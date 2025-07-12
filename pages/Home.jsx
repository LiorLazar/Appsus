
const { Link } = ReactRouterDOM

export function Home() {
    return <section className="home">
        <h1>Appsus</h1>
        <h4>Center All Your Everyday Apps Into One Location</h4>
        <div className='apps-container'>
            <Link to='mail/inbox'>
                <img className="mail-logo" src="../assets/img/gmail-logo.webp" alt="Gmail" />
            </Link>
            <Link to="note">
                <img className="keep-logo-home" src="../assets/img/keep-logo.png" alt="Google Keep" />
            </Link>
        </div>
        <Link className="about-btn" to='/about'>About</Link>
    </section >
}