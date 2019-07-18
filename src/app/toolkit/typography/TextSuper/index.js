/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextSuper
 * -----------------------------------------------------------------------------
 */

export default class TextSuper extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.id : null;
    }

    render() {
        return (
            <p>
                <Lipsum length={58} />
                <sup>4</sup>
            </p>
        );
    }
}
