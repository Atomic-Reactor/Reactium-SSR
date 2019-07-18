import op from 'object-path';
import _ from 'underscore';

export const moduleList = {};

/**
 * Registration function used by dna webpack loader as bundle files are loaded to
 * collect the imports (children) of each module.
 * @see .core/loaders/dna/index.js
 * @param  {Oject} m webpack provided module
 */
export const register = m => {
    if (typeof m.children !== 'undefined') {
        op.set(moduleList, [m.id], m.children);
    }
};

/**
 * Get promise for full list of webpack component module names by webpack id
 * Webpack turns all ids from human readable to numeric in production build, so
 * we need a reference object.
 *
 * returns a promise because these references will resolve async in production bundles
 *
 * @return {Promise} reference list
 * e.g. Development: { "./Demo/Site/Button/index.js": "./src/app/components/Demo/Site/Button/index.js", ... }
 * e.g. Production: { 1: "./src/app/components/Demo/Site/Button/index.js", ... }
 */
export const componentModuleNames = () => {
    const manifest = require('manifest');
    const contexts = manifest.contexts;
    const contextList = manifest.listContexts();

    const moduleNames = Object.entries(contexts)
        // only search components
        .filter(([name]) => !['toolkit', 'core'].find(nope => name === nope))
        .reduce(
            (moduleNames, [name, context]) => {
                context.keys().forEach(id => {
                    moduleNames.ids.push({
                        id,
                        context: contextList[name].modulePath,
                    });
                    moduleNames.names.push(context.resolve(id));
                });
                return moduleNames;
            },
            { ids: [], names: [] },
        );

    return Promise.all(moduleNames.names).then(names =>
        names.reduce((resolvedNames, name, idx) => {
            resolvedNames[name] = `${
                moduleNames.ids[idx].context
            }${moduleNames.ids[idx].id.replace(/^\.\//, '')}`;
            return resolvedNames;
        }, {}),
    );
};

const dna = (children = []) => {
    return componentModuleNames().then(resolved => {
        const relevant = _.uniq(children.filter(child => child in resolved));
        return relevant.map(id => resolved[id]);
    });
};

export default dna;
