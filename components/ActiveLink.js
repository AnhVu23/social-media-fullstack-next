import {withRouter} from 'next/router'

const ActiveLink = ({router, href, children}) => {
    const prefetchPages = () => {
        if (typeof window !== 'undefined') {
            router.prefetch(router.pathname)
        }
    }
    prefetchPages()
    const handleClick = e => {
        e.preventDefault()
        router.push(href)
    }
    const isCurrentPath = href === router.pathname || href === router.asPath
    return (
        <div>
            <a href={href} onClick={handleClick} style={{
                textDecoration: 'none',
                margin: 0,
                padding: 0,
                fontWeight: isCurrentPath ? 'bold' : 'normal',
                color: isCurrentPath ? '#C62828' : '#fff'
            }}>
                {children}
            </a>
        </div>
    )
};

export default withRouter(ActiveLink)
