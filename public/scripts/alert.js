function alert(m) {
    return new Promise(resolve => {
        m = m.replace(/\n/gi, '<br>');
        const alert = document.createElement("div");
        alert.setAttribute("class", "alert");
        const msg = document.createElement("div");
        msg.innerHTML = m;
        const okbtn = document.createElement("button");
        okbtn.setAttribute("class", "al_okbtn");
        okbtn.innerText = "확인";
        alert.appendChild(msg);
        alert.appendChild(okbtn);

        document.body.appendChild(alert);

        okbtn.focus();

        okbtn.onclick = () => {
            alert.remove();
            resolve(undefined);
        }
    });
}

function prompt(m, val = null, type = "text") {
    return new Promise(resolve => {
        m = m.replace(/\n/gi, '<br>');
        const alert = document.createElement("div");
        alert.setAttribute("class", "prompt");
        const msg = document.createElement("div");
        msg.innerHTML = m;

        const inp = document.createElement("input");
        inp.setAttribute("type", type);
        inp.setAttribute("class", "al_inputBox");
        inp.value = val;

        const okbtn = document.createElement("button");
        okbtn.setAttribute("class", "al_okbtn");
        okbtn.innerText = "확인";

        alert.appendChild(msg);
        alert.appendChild(inp);
        alert.appendChild(okbtn);

        document.body.appendChild(alert);

        inp.focus();

        inp.onkeydown = function() {
            if(event.keyCode == 13) {
                okbtn.click();
            }
        }

        okbtn.onclick = () => {
            alert.remove();
            resolve(inp.value);
        }
    });
}

function confirm(m) {
    return new Promise(resolve => {
        m = m.replace(/\n/gi, '<br>');
        const alert = document.createElement("div");
        alert.setAttribute("class", "confirm");
        const msg = document.createElement("div");
        msg.innerHTML = m;

        const buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("class", "al_buttonBox");

        const okbtn = document.createElement("button");
        okbtn.setAttribute("class", "al_okbtn");
        okbtn.innerText = "확인";
        const cancelbtn = document.createElement("button");
        cancelbtn.setAttribute("class", "al_cancelbtn");
        cancelbtn.innerText = "취소";

        buttonDiv.appendChild(okbtn);
        buttonDiv.appendChild(cancelbtn);

        alert.appendChild(msg);
        alert.appendChild(buttonDiv);

        document.body.appendChild(alert);

        cancelbtn.focus();

        okbtn.onclick = () => {
            alert.remove();
            const value = true;
            resolve(true);
        }

        cancelbtn.onclick = () => {
            alert.remove();
            resolve(false);
        }
    });
}

document.oncontextmenu = () => {
    return false;
}

document.onmousedown = () => {
    if(event.target.getAttribute("class") != "al_inputBox" && hasAlert()) {
        event.preventDefault();
        return false;
    }
}

const hasAlert = () => {
    return document.getElementsByClassName("alert").length > 0 || document.getElementsByClassName("prompt").length > 0 || document.getElementsByClassName("confirm").length > 0;
}