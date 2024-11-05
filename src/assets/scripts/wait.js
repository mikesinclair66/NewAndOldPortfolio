function wait(t, func){
    let interval = window.setInterval(() => {
        func();
        window.clearInterval(interval);
    }, t);
}

export default wait;