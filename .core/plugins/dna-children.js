class DnaChildrenPolyfill {
    constructor(options) {
        this.options = options || { test: /\.jsx?$/ };
        this.onCompilation = this.onCompilation.bind(this);
        this.onAfterOptimizeModuleIds = this.onAfterOptimizeModuleIds.bind(
            this,
        );
    }

    /**
     * apply: the bare minimimum method to make a plugin
     */
    apply(compiler) {
        compiler.hooks.compilation.tap(
            'DnaChildrenPolyfill',
            this.onCompilation,
        );
    }

    onCompilation(compilation) {
        compilation.hooks.afterOptimizeModuleIds.tap(
            'DnaChildrenPolyfill',
            this.onAfterOptimizeModuleIds,
        );
    }

    onAfterOptimizeModuleIds(modules) {
        Object.entries(modules).forEach(([key, mod]) => {
            if (this.options.test.test(mod.userRequest)) {
                if (
                    /require\('dna'\)\.register\(module\)/.test(
                        mod._source._value,
                    )
                ) {
                    const ids = mod.dependencies
                        .map(({ module: mod }) => mod)
                        .filter(m => m)
                        .map(m => m.id)
                        .filter(id => id);
                    if (ids.length) {
                        mod._source._value = mod._source._value.replace(
                            "require('dna').register(module)",
                            `require('dna').register(${JSON.stringify({
                                id: mod.id,
                                children: ids,
                            })})`,
                        );
                    }
                }
            }
        });
    }
}

module.exports = DnaChildrenPolyfill;
