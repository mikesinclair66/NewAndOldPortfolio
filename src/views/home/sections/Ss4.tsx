import './ss4.scss';

import React, { useState, useEffect } from 'react';
import OnHoverIcon from '../../../components/on_hover_icon/OnHoverIcon';

interface Ss4Props {
    desktopImplementation: boolean;
}

const Ss4: React.FC<Ss4Props> = ({ desktopImplementation }) => {
    const [collapseActive, setCollapseActive] = useState<number>(0);

    useEffect(() => {
        let cbs = document.getElementById('skills-container');
        if(cbs){
            let buttons = cbs.getElementsByClassName('cb');
            for(let i = 0; i < buttons.length; i++)
                buttons[i].addEventListener('pointerdown', () => {
                    setCollapseActive(i);
                    window.scrollTo({ top: document.getElementById(`ss-c-${collapseActive}`)?.offsetTop, behavior: 'smooth' });
                });
        }
    }, []);

    return (
        <div id="ss-4">
            <div id="skills-container" className={`align-${desktopImplementation ? 'center' : 'vertical-reverse'}`}>
                <img src={`/graphics/trophy${desktopImplementation ? '' : '_small'}.png`} alt="Skills" id="trophy" />
                <div id="skills" className="align-center">
                    <div id="sc-inner">
                        <h1>SKILLS</h1>

                        <div className="skill-section">
                            <h3>FRONT END</h3>

                            <div className="align-center cbs">
                                <div className="road-btn" id={ collapseActive == 0 ? 'web-rb-discovered' : 'web-dev-btn' }
                                onPointerDown={() => setCollapseActive(0)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">Web Development</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                                <div className="road-btn" id={ collapseActive == 1 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(1)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">Desktop/Mobile Development</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ch-container">
                                <div className={`collapse-hidden${collapseActive == 0 ? '-joking' : ''}`}>
                                    <p>My favourite framework is Vue, but I get along well with React. I&#39;m
                                        gifted with plenty of experience in JavaScript. I spent a lot of my upbringing coding
                                        and designing static websites using only the vanilla languages. Once I had started
                                        on Vue, I began to challenge myself and took on full-stack web apps with large
                                        back-ends.</p>
                                </div>

                                <div className={`collapse-hidden${collapseActive == 1 ? '-joking' : ''}`}>
                                    <p>My programming languages for mobile are Swift and C++ using xCode. My most common
                                        frameworks for desktop and mobile are GLFW and SFML. I tend to develop my own widgets
                                        down to the last pixel... I do this because I want my projects to be done the best way
                                        they can be. However, I&#39;m aware that this is not always conducive to fast-paced
                                        working and try to finish tasks quickly so I can move onto the next one.</p>
                                </div>
                            </div>
                        </div>

                        <div className="skill-section">
                            <h3>BACK END</h3>

                            <div className="align-center cbs">
                                <div className="road-btn" id={ collapseActive == 2 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(2)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">RESTful Frameworks</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                                <div className="road-btn" id={ collapseActive == 3 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(3)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">API Calls/Production</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ch-container">
                                <div className={`collapse-hidden${collapseActive == 2 ? '-joking' : ''}`}>
                                    <p>I&#39;ve had the most experience with Express when it comes to RESTful frameworks. HOWEVER,
                                        I have 11+ years of experience with Java, so my experience with Spring Boot has been
                                        easy-going.</p>
                                </div>

                                <div className={`collapse-hidden${collapseActive == 3 ? '-joking' : ''}`}>
                                    <p>I&#39;ve had plenty of experience managing APIs for business websites.
                                        Some examples are the UPS Rates API to produce shipping approximations and operating
                                        an e-commerce app through the Stripe API.</p>
                                </div>
                            </div>
                        </div>

                        <div className="skill-section">
                            <h3>DATABASE</h3>

                            <div className="align-center cbs">
                                <div className="road-btn" id={ collapseActive == 4 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(4)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">Database</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ch-container">
                                <div className={`collapse-hidden${collapseActive == 4 ? '-joking' : ''}`}>
                                    <p>When I started taking on Vue projects, my experience with databases skyrocketed.
                                        I&#39;ve worked consistently with json/properties files and generally prefer to use Mongo
                                        DB over SQL (Who doesn&#39;t?). However, I&#39;m equipped with a good understanding of which
                                        database to use depending on the purpose of the app.</p>
                                </div>
                            </div>
                        </div>

                        <div className='skill-section'>
                            <h3>ENGINEERING / DEVELOPMENT</h3>

                            <div className='align-center cbs'>
                                <div className="road-btn" id={ collapseActive == 5 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(5)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">Project Planning</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                                <div className="road-btn" id={ collapseActive == 6 ? 'rb-discovered' : '' }
                                onPointerDown={() => setCollapseActive(6)}>
                                    <div className="road-btn-inner">
                                        <div className="road-top road-layer align-center">
                                            <span className="road-msg">Advanced Pair Programming</span>
                                        </div>

                                        <div className="road-bottom road-layer"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ch-container">
                                <div className={`collapse-hidden${collapseActive == 5 ? '-joking' : ''}`}>
                                    <p>Some people say you either have the talent to become an engineer or you don&#39;t.
                                        I disagree, but I definitely have it. As a web developer, there exist many tedious
                                        processes when it comes to coding up a web app. As a software engineer, I like
                                        to identify the tedious tasks and eliminate them by creating good software.</p>
                                </div>

                                <div className={`collapse-hidden${collapseActive == 6 ? '-joking' : ''}`}>
                                    <p>I don&#39;t often pair program with a real human partner; What I mean by pair
                                        programming is that I make full use of ChatGPT to help identify how to use a
                                        new library, framework, or API. I also often compare my strategy for devising a complex
                                        structure to what ChatGPT suggests to complete the task at hand.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <div>
                    &#169; Copyright 2024 | Michael Sinclair | <a href="https://intivatechnologies.ca" target="_blank">
                    Intiva Technologies</a> | All Rights Reserved
                </div>
            </footer>
        </div>
    );
}

export default Ss4;