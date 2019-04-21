import { createElement } from 'react'

function importAll(r) {
    return r.keys().map(key => [key, r(key).default])
}

class IconList {

    constructor() {
        this.icons = importAll(require.context('../icons/', true, /\.svg$/))
    }

    map(callback) {
        return this.icons.map(callback)
    }

    atIndex(index) {
        return this.icons[index]
    }

    keyAtIndex(index) {
        return this.icons[index][0]
    }

    matching(q) {
        return this.icons.filter(([key, Icon]) => key.indexOf(q) >= 0)
    }

    withKey(queryKey, props) {
        const icon = this.icons
            .filter(([key, Icon]) => key === queryKey)
            .map(([key, Icon]) => Icon)

        if (icon.length) {
            return createElement(icon[0], props)
        }

        return false
    }

}

export default new IconList