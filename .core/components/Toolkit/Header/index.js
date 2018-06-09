
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    render() {
        return (
            <header className={'re-toolkit-header'}>
                <img className={'re-toolkit-header-logo'} src={'/assets/images/logo.png'} />
                <h1>Style Guide</h1>
            </header>
        );
    }
}

Header.defaultProps = {};