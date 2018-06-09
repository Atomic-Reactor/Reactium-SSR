
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import ToolbarIcons from './ToolbarIcons';

/**
 * -----------------------------------------------------------------------------
 * React Component: Toolbar
 * -----------------------------------------------------------------------------
 */

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    render() {
        let { buttons } = this.state;

        return (
            <nav className={'re-toolkit-toolbar'}>
                <ToolbarIcons />
                {
                    buttons.map((item, i) => {
                        let { icon, name, label = null, cls = null } = item;
                        return (name === 'spacer')
                            ? (
                                <div className={'spacer'} key={`re-toolkit-toolbar-${i}`}></div>
                            ) : (
                                <button type={'button'} key={`re-toolkit-toolbar-${i}`} id={`toolbar-${name}`} className={cls}>
                                    <svg>
                            			<use xlinkHref={icon}></use>
                            		</svg>
                                    {(label) ? (<div>{label}</div>) : ''}
                                </button>
                            );
                    })
                }
            </nav>
        );
    }
}

Toolbar.defaultProps = {
    buttons: [
        {icon:'#re-icon-dna', name: 'filter-all', label: 'All Elements'},
        {icon: '#re-icon-atom', name: 'filter-atom', label: 'Atoms'},
        {icon: '#re-icon-molecule', name: 'filter-molecule', label: 'Molecules'},
        {icon: '#re-icon-organism', name: 'filter-organism', label: 'Organisms'},
        {icon: '#re-icon-template', name: 'filter-template', label: 'Templates'},
        {name: 'spacer'},
        {icon: '#re-icon-settings', name: 'toggle-settings', cls: 'toggle'},
        {icon: '#re-icon-chevron-left', name: 'toggle-sidebar', cls: 'toggle'}
    ]
};