import './ss3.scss';
import fetch_api from 'src/assets/scripts/fetch_api';
import scroll_to_bottom from 'src/assets/scripts/scroll_to_bottom';

import React, { useState, useEffect } from 'react';

interface Ss3Props {
    desktopImplementation: boolean;
    getInTouch: () => void;
}

const Ss3: React.FC<Ss3Props> = ({ desktopImplementation, getInTouch }) => {
    const [customHighlight, setCustomHighlight] = useState<boolean[]>([false, false]);

    const setHighlight = (index: number, bool: boolean) => {
        let val = [false, false];
        val[index] = bool;
        setCustomHighlight(val);
    }

    useEffect(() => {
        for(let i = 1; i < 3; i++){
            let clb = document.getElementById(`clb-${i}`)?.getElementsByClassName('clb-second')[0];
            clb?.addEventListener('mouseover', () => setHighlight(i - 1, true));
            clb?.addEventListener('mouseout', () => setHighlight(i - 1, false));
        }
    }, []);

    const downloadResume = () => {
        let fetchApi = new fetch_api({ host: process.env.REACT_APP_HOST, port: process.env.REACT_APP_PORT });
        fetchApi.getPdf('/api/download_resume/dev', (blob: BlobPart) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            
            link.href = url;
            link.setAttribute("download", "Resume_Michael_Sinclair.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        });
    }

    return (
        <div id="ss-3">
            <div id="ri-container" className="align-center introduction-container">
                <div id="resume-introduction" className='introduction'>
                    <div id="cert" className={`continue-flex align-${desktopImplementation ? 'right' : 'center'}`}>
                        <h5>Microsoft Certified: Azure Fundamentals</h5>
                    </div>

                    <div id="resume-bio">
                        <h3>I&#39;m looking for work!</h3>
                        <p>Soon I&#39;ll be completing my degree, although I&#39;m not currently enrolled in any
                            course work. My work schedule is very flexible, but I expect that to change soon. Don&#39;t
                            wait too long to get in touch!</p>
                    </div>

                    {/* Gumroad.com inspired buttons */}
                    <div id="contact-outlets" className="align-center">
                        <div id="git-btn" className="road-btn">
                            <div className="road-btn-inner" onPointerDown={scroll_to_bottom}>
                                <div className="road-top road-layer align-center">
                                    <span className="road-msg">Contact Me</span>
                                </div>

                                <div className="road-bottom road-layer"></div>
                            </div>
                        </div>

                        <div id="download-btn" className="road-btn">
                            <div className="road-btn-inner" onPointerDown={downloadResume}>
                                <div className="road-top road-layer align-center">
                                    <span className="road-msg">Download Resume</span>
                                    <img src="/graphics/download_black.png" alt="Download Resume" />
                                </div>

                                <div className="road-bottom road-layer"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="experience-container align-center">
                <div className={`experience${desktopImplementation ? ' align-horizontal' : ""}`}>
                    <div className="experience-header">
                        <div>
                            <h4>EDUCATION</h4>
                            <span></span>
                        </div>
                    </div>

                    <div>
                        <div className="experience-group">
                            <h5>Bachelor of Technology (Game Development Option)</h5>
                            <div className="enrollment">British Columbia Institute of Technology
                            (<a href="https://www.bcit.ca" target="_blank">BCIT</a>) &#8226; 2020 - Present</div>
                            <p>Grouped in teams to complete large projects under strict deadlines. Extensive use of game engines
                                like Unity and frameworks like GLFW and OpenGLES for Desktop and iOS development. Learned agile
                                methods to work as a team. Participated in hackathons and group events.</p>
                        </div>

                        <div className="experience-group">
                            <h5>Diploma in Computer Systems Technology (Business Ideation Option)</h5><div className='enrollment'>
                            <a href="https://www.bcit.ca" target="_blank">BCIT</a> &#8226; 2018 - 2020</div>
                            <p>Prior to my experience here, I was self-taught, so I learned very quickly all programming-related
                                topics here at BCIT and polished my understanding of software design patterns. Learned full-stack,
                                UI/UX techniques, OOP, and procedural programming with C.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="experience-container align-center">
                <div className={`experience${desktopImplementation ? ' align-horizontal' : ''}`}>
                    <div className="experience-header">
                        <div>
                            <h4>EXPERIENCE</h4>
                            <span></span>
                        </div>
                    </div>

                    <div>
                        <div className='experience-group'>
                            <h5>Software Developer / Engineer</h5>
                            <div className="enrollment">
                            <a href="https://intivatechnologies.ca" target="_blank">Intiva Technologies</a> &#8226;
                            December 2020 - Present</div>
                            <ul>
                                <li>Marketed and developed products for over ten companies
                                    including websites, cards, logos, and signs.</li>
                                <li>Supercharged development process of websites and web
                                    apps by engineering software to produce code repositories.</li>
                                <li>Routed full-stack web apps to be loaded with NGINX.</li>
                                <li>Learned how to integrate with complex libraries and API’s.</li>
                            </ul>
                        </div>

                        <div className='experience-group'>
                            <h5>Electronics / Arcade Technician</h5>
                            <div className="enrollment">
                            <a href="https://www.cineplex.com" target="_blank">Cineplex</a>
                            &#160;&#8226; December 2023 - May 2024</div>
                            <ul>
                                <li>Applied my understanding of software and control systems
                                    to troubleshoot problems with arcade mechanisms</li>
                                <li>Gained valuable insights on the industry and its market.</li>
                                <li>Had to be able to perform well in a high-pressure
                                    environment and think on the spot.</li>
                                <li>Performed administrative duties to troubleshoot problems
                                    with electronic components.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ss3;