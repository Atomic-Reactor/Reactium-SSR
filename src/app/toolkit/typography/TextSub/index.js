/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextSub
 * -----------------------------------------------------------------------------
 */

export default class TextSub extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.id : null;
    }

    render() {
        return (
            <p>
                <Lipsum length={58} />
                <sub>4</sub>
            </p>
        );
    }
}
