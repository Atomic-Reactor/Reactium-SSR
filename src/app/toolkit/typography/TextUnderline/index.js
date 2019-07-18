/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextUnderline
 * -----------------------------------------------------------------------------
 */

export default class TextUnderline extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.id : null;
    }

    render() {
        return (
            <p>
                <u>
                    <Lipsum length={58} />.
                </u>
            </p>
        );
    }
}
