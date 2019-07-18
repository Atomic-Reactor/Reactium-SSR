/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: Paragraph
 * -----------------------------------------------------------------------------
 */

export default class Paragraph extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.id : null;
    }

    render() {
        return (
            <p>
                <Lipsum />
            </p>
        );
    }
}
