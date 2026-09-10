import {
    AlertCircle,
    FileText,
    Image,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import './Rights.scss';

const Rights = () => {
    return (
        <main className="rights">
            <div className="rights__container">
                <div className="rights__intro">
                    <span className="rights__eyebrow">
                        LEGAL INFORMATION
                    </span>

                    <h1 className="rights__title">
                        Rights & Terms of Use
                    </h1>

                    <p className="rights__description">
                        Please review the terms that apply to
                        the use of the StepOut platform,
                        uploaded content and event listings.
                    </p>
                </div>

                <div className="rights__content">
                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <FileText size={19} />
                            </div>

                            <h2>
                                Intellectual property
                            </h2>
                        </div>

                        <p>
                            All interface layouts, custom
                            visuals, brand assets and
                            application code used by StepOut
                            are protected intellectual
                            property. They may not be scraped,
                            copied, reproduced or redistributed
                            without prior written permission.
                        </p>
                    </section>

                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <Image size={19} />
                            </div>

                            <h2>
                                Event organizer content
                            </h2>
                        </div>

                        <p>
                            Event organizers are solely
                            responsible for the accuracy of
                            their listings, venue details,
                            pricing and the rights or licenses
                            associated with uploaded media.
                            By publishing an event, organizers
                            grant StepOut permission to display
                            and promote that content through
                            the platform.
                        </p>
                    </section>

                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <ShieldCheck size={19} />
                            </div>

                            <h2>
                                Third-party media
                            </h2>
                        </div>

                        <p>
                            Generic category imagery may
                            originate from open-license
                            repositories or other sources
                            permitted for use. If you believe
                            copyrighted work is displayed
                            without authorization, please
                            contact us so the material can be
                            reviewed and, where appropriate,
                            removed.
                        </p>
                    </section>

                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <AlertCircle size={19} />
                            </div>

                            <h2>
                                Platform responsibility
                            </h2>
                        </div>

                        <p>
                            StepOut operates as an event
                            discovery intermediary. We are not
                            responsible for schedule changes,
                            cancellations, pricing disputes,
                            venue conditions or incidents that
                            occur during physical events.
                            Organizers remain responsible for
                            the events they publish.
                        </p>
                    </section>

                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <ShieldCheck size={19} />
                            </div>

                            <h2>
                                Personal data
                            </h2>
                        </div>

                        <p>
                            Personal data is handled securely
                            and used to provide and improve
                            your StepOut experience, including
                            account features and event
                            registration functionality.
                        </p>
                    </section>

                    <section className="rights__section">
                        <div className="rights__section-header">
                            <div className="rights__icon">
                                <FileText size={19} />
                            </div>

                            <h2>
                                Updates to these terms
                            </h2>
                        </div>

                        <p>
                            We may update these terms from time
                            to time to reflect changes to the
                            platform, its features or applicable
                            requirements. The latest version
                            will be published on this page.
                        </p>
                    </section>
                </div>

                <div className="rights__contact">
                    <div className="rights__contact-icon">
                        <Mail size={19} />
                    </div>

                    <div>
                        <span className="rights__contact-label">
                            LEGAL INQUIRIES
                        </span>

                        <p>
                            For copyright, legal or content
                            questions, contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Rights;