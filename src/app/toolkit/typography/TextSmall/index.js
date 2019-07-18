/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextSmall
 * -----------------------------------------------------------------------------
 */

export default class TextSmall extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.id : null;
    }

    render() {
        return (
            <small>
                <Lipsum length={58} />.
            </small>
        );
    }
}
