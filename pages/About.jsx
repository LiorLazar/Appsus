const { Link } = ReactRouterDOM

export function About() {

    return <div className="about">
        <h1>
            About Us
        </h1>
        <section className="team">
            {/* Lior */}
            <section className="each-member">
                <div className="image-container">
                    <img className="" src="./assets/img/profile-image-lior.jpeg" alt="" />
                </div>
                <h4>Lior Lazar</h4>
                <p className="">Full Stack Web Developer</p>
                <a href="https://www.linkedin.com/in/lior-lazar/">
                    <i className="fa fa-linkedin"></i>
                </a>

                <p className="about-description"><span className=""></span>
                    is a Full Stack Developer with an Cybersecurity background from his experience in the industery as Tier 3 SOC Analyst.
                    In addition, he worked with TrustNet as an Security Automation Engineer for about a year.</p>
            </section>
            {/* Golan */}
            <section className="each-member">
                <div className="image-container">
                    <img className="" src="./assets/img/profile-image-golan.jpeg" alt="" />
                </div>
                <h4>Goaln Asraf</h4>
                <p className="">Full Stack Web Developer</p>

                <p className="about-description"><span className=""></span>
                    is a Full Stack Developer, currently in Coding Academy Course.</p>
            </section>
        </section>
        <Link to="/" className="back-home">
            <span className="material-symbols-outlined">home</span>
            Back to Home
        </Link>
    </div>
}