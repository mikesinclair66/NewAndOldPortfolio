import './ss5.scss';
import fetch_api from '../../../assets/scripts/fetch_api';

import React, { useState, useRef, useEffect } from 'react';

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const [contactStage, setContactStage] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [textMsg, setTextMsg] = useState<string>("");
    const [codeInputSelect, setCodeInputSelect] = useState<number>(0);

    const instanceId = useRef<string>("");

    const fetchApi = useRef(new fetch_api({
        host: process.env.REACT_APP_HOST,
        port: process.env.REACT_APP_PORT
    }));

    const getButtonLabel = (number: number) => {
        switch(number){
            case 0:
                return 'First Verify Your Email';
            case 1:
                return 'Verify Code';
            case 2:
                return 'Send Message';
            case 3:
            default:
                return 'Back to Top';
        }
    }

    const validateProceed = () => {
        interface ValidateResponses {
            reason?: string;
            id?: string;
        }

        interface VerifyResponses {
            reason?: string;
            code?: string;
        }

        let code: string = '';
        switch(contactStage){
            case 0:
                fetchApi.current.postJson("/api/contact/validate", [
                    name,
                    email
                ], (data: ValidateResponses) => {
                    if(data.reason)
                        setErrorMsg(data.reason);
                    else if(data.id){
                        instanceId.current = data.id;
                        setContactStage(1);
                    }
                });
                break;
            case 1:
                code = '';
                let codeInputs = document.getElementById('code-inputs')?.getElementsByTagName('input');
                const inputArray = codeInputs ? Array.from(codeInputs) : [];
                if(inputArray.length == 4)
                    for(let ci of inputArray)
                        if(ci)
                            code += ci.value[0];

                fetchApi.current.postJson("/api/contact/verify", {
                    code: code,
                    id: instanceId.current
                }, (data: VerifyResponses) => {
                    if(data.reason)
                        setErrorMsg(data.reason);
                    else if(data.code == "200")
                        setContactStage(2);
                });
                break;
            case 2:
            default:
                fetchApi.current.postJson("/api/contact/send_message", {
                    id: instanceId.current,
                    message: (document.getElementById('fc-textarea') as HTMLTextAreaElement)?.value
                }, (data: object) => {
                    if(data)
                        setContactStage(3);
                    else
                        setErrorMsg("An error occurred. Please try again later.");
                });
                break;
        }
    }

    const determineProceed = () => {
        if(contactStage < 3)
            validateProceed();
        else
            window.scrollTo({ top: 0 });
    }

    useEffect(() => {
        setErrorMsg("");
        if(contactStage == 1){
            let codeInput = document.getElementById('code-inputs')?.getElementsByTagName('input')[codeInputSelect];
            const tabMethod = () => {
                if(codeInputSelect < 3){
                    if(codeInput && codeInput.value.length > 1){
                        let totalStr = codeInput.value;
                        codeInput.value = totalStr[0];

                        for(let i = codeInputSelect + 1; i < codeInputSelect + totalStr.length; i++){
                            let nCodeInput = document.getElementById('code-inputs')?.getElementsByTagName('input')[i];
                            if(nCodeInput)
                                nCodeInput.value = totalStr[i - codeInputSelect];
                        }
                    } else
                        setCodeInputSelect(codeInputSelect + 1);
                } else
                    determineProceed();
            }

            codeInput?.focus();
            codeInput?.addEventListener('input', tabMethod);
            return () => codeInput?.removeEventListener('input', tabMethod);
        }
    }, [contactStage, codeInputSelect]);

    return (
        <div id="ss-5">
            <div id="ss-5-highlight" className="fill align-center">
                <div id="ss-5-inner" className='align-center'>
                    <div id="ss-5-content">
                        { contactStage == 0 && <div id="ss-5-header">
                            <h1>Say Hello</h1>
                            <h6>I won&#39;t bite!</h6>
                        </div> }
                        { (contactStage == 1 || contactStage == 2) && <div id="ss-5-header">
                            <h6 style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onPointerDown={() => setContactStage(0)}>Go Back</h6>
                            <br /><h6>Enter your code</h6>
                        </div> }
                        {contactStage == 3 && <div id="ss-5-header">
                            <h6>Your message was sent!</h6>
                        </div> }

                        <div id="form-container">
                            <form id="fc-form">
                                <div id="fc-form-content">
                                    <div id="fc-error" className="align-center">
                                        { errorMsg.length > 0 && <div id="fc-error-inner">{ errorMsg }</div> }
                                    </div>
                                    
                                    { contactStage == 0 && <div id={ desktopImplementation ? '' : 'fe-iphone-imp' }
                                        className={ desktopImplementation ? 'align-center' : '' }>
                                        <div className='form-element'>
                                            <h5>NAME</h5>
                                            <input type="text" placeholder='Enter Your Name' id="name-input" value={name}
                                            onChange={ ev => setName(ev.target.value) } />
                                        </div>

                                        <div className='form-element'>
                                            <h5>EMAIL</h5>
                                            <input type="text" placeholder='Enter Your Email' id="email-input" value={email}
                                            onChange={ ev => setEmail(ev.target.value) } />
                                        </div>
                                    </div> }

                                    { contactStage == 1 && <div className='form-element' id="cs-1">
                                        <div id="code-inputs" className="align-center">
                                            <input type="text" onFocus={() => setCodeInputSelect(0)} />
                                            <input type="text" onFocus={() => setCodeInputSelect(1)} />
                                            <input type="text" onFocus={() => setCodeInputSelect(2)} />
                                            <input type="text" onFocus={() => setCodeInputSelect(3)} />
                                        </div>
                                    </div> }

                                    { contactStage == 2 && <div className="form-element">
                                        <h5>YOUR MESSAGE</h5>
                                        <textarea value={ textMsg } onChange={ev => setTextMsg(ev.target.value)}
                                            id="fc-textarea"></textarea>
                                    </div> }
                                </div>

                                <div id="fc-btn" className="align-center">
                                    <div className="road-btn" onPointerDown={determineProceed}>
                                        <div className="road-btn-inner">
                                            <div className="road-top road-layer align-center">
                                                <span className="road-msg">{ getButtonLabel(contactStage) }</span>
                                            </div>

                                            <div className="road-bottom road-layer"></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ss5;