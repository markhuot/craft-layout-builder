import React from 'react'

const SearchBox = props => {
    return <input type="search"
                  className="clb-w-full clb-py-2 clb-px-1 clb-text-base clb-appearance-none clb-border clb-border-solid clb-focus:border-color-blue"
                  autoFocus
                  placeholder="Search..."
                  onChange={props.onChange}
                  onKeyUp={props.onKeyUp}
                  onFocus={props.onFocus}
                  onBlur={props.onBlur}/>
}

export default SearchBox