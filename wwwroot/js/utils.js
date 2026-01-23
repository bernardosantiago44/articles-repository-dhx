function C_UTILS() {
    this.QUERY_STRING = null;
}

C_UTILS.prototype.getQueryParam = function (name) {
    if (!this.QUERY_STRING) this.QUERY_STRING = location.search;

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(this.QUERY_STRING);
    results = (results == null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    return results;
}

C_UTILS.prototype.getSelectValues = function (selName) {
    var result = "";
    var select = this.getDom(selName);
    var options = select && select.options;

    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            if (result != "")
                result += ",";
            result += opt.value || opt.text;
        }
    }
    return result;
}

C_UTILS.prototype.setSelectValues = function (selName, strValues) {
    strValues = strValues.replaceAll(", ", ",");
    var select = this.getDom(selName);
    var options = select && select.options;

    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];
        options[i].selected = false;
        if (("," + strValues + ",").indexOf("," + opt.value + ",") > -1)
            options[i].selected = true;
    }
}

C_UTILS.prototype.deleteSelectOptions = function (selName) {
    this.getDom(selName).options.length = 0;
}

C_UTILS.prototype.addSelectOption = function (selectID, display, value) {
    var sel = this.getDom(selectID);
    sel.options[sel.options.length] = new Option(display, value);
}

C_UTILS.prototype.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

C_UTILS.prototype.resetForm = function (formName) {
    // clearing inputs
    var form = this.getDom(formName);
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        switch (inputs[i].type) {
            // case 'hidden':
            case 'text':
                inputs[i].value = '';
                break;
            case 'radio':
            case 'checkbox':
                inputs[i].checked = false;
        }
    }

    // clearing selects
    var selects = form.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++)
        selects[i].selectedIndex = 0;

    // clearing textarea
    var text = form.getElementsByTagName('textarea');
    for (var i = 0; i < text.length; i++)
        text[i].innerHTML = '';

    return false;
}

C_UTILS.prototype.getDom = function (elementId) {
    var object = null;
    if (document.getElementById)
        object = document.getElementById(elementId);
    else if (document.all)
        object = document.all[elementId];
    else if (document.layers)
        object = document.layers[elementId];
    return object;
}

C_UTILS.prototype.Ajax = function  (url, params, callbakOK, callbackERR) {
    /* IMPORTANTE: la 'url' llamada debe implementar una respuesta de tipo: 
        { 
            estatus: "OK",  // cualquier otro valor ("ERROR", "SESION", etc.) implica que el resultado es incorrecto
            mensaje: "mensaje relativo al 'estatus'", 
            data: <cualquier tipo de objeto (simple o complejo) en caso de que la peticion requiera regresar datos>
        }
    */
    var connection = navigator.onLine;
    if (connection) {
        window.dhx.ajax.query({
            method: "POST", // GET / POST
            url: url,
            data: JSON.stringify(params),
            async: true,
            callback: function (result) {
                //  result.xmlDoc => status=200   statusText="OK"  responseXML
                if (result && result.xmlDoc.status == 200) {
                    //res = window.dhx.s2j(result.xmlDoc.responseText).d; // convert response to json object
                    res = JSON.parse(result.xmlDoc.responseText);
                    if (res.estatus == "OK") {
                        callbakOK(res);
                    } else {
                        callbackERR(res);
                    }
                } else {
                    res = { estatus: result.xmlDoc.status + " " + result.xmlDoc.statusText, mensaje: result.xmlDoc.statusText, data: null };
                    callbackERR(res);
                }
            },
            headers: {
                'Accept': 'application/json',
                'Data-Type': 'json',
                'Content-Type': 'application/json;charset=utf-8;'
            }
        });
        window.dhx.attachEvent("onAjaxError", function (r) {
            var res = {
                estatus: r.xmlDoc.status + " " + r.xmlDoc.statusText,
                mensaje: r.xmlDoc.statusText,
                data: null
            };
            var err = window.dhx.s2j(r.xmlDoc.responseText);
            if (err)
                res.mensaje = err.Message;

            callbackERR(res);
        });
    }
}

C_UTILS.prototype.Ajax2 = function (url, params, callbakOK, callbackERR) {
    var connection = navigator.onLine;
    if (connection) {
        window.dhx.ajax.query({
            method: "POST", // GET / POST
            url: url,
            data: params,
            async: true,
            processData: false,
            contentType: false,
            callback: function (result) {
                if (result && result.xmlDoc.status == 200) {
                    res = window.dhx.s2j(result.xmlDoc.responseText).d;
                    if (res.estatus == "OK") {
                        callbakOK(res);
                    } else {
                        callbackERR(res);
                    }
                } else {
                    res = { estatus: result.xmlDoc.status + " " + result.xmlDoc.statusText, mensaje: result.xmlDoc.statusText, data: null };
                    callbackERR(res);
                }
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        window.dhx.attachEvent("onAjaxError", function (r) {
            var res = {
                estatus: r.xmlDoc.status + " " + r.xmlDoc.statusText,
                mensaje: r.xmlDoc.statusText,
                data: null
            };
            var err = window.dhx.s2j(r.xmlDoc.responseText);
            if (err)
                res.mensaje = err.Message;

            callbackERR(res);
        });
    }
}

C_UTILS.prototype.LoadedInFrame = function () {
    var loadedInFrame = false;
    try {
        loadedInFrame = (window.self !== window.top);
        //loadedInFrame = (window.frameElement);
    } catch (e) {
        loadedInFrame = true;
    }
    return loadedInFrame;
}

// add event cross browser
C_UTILS.prototype.addEvent = function (elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
        elem.attachEvent("on" + event, function () {
            // set the this pointer same as addEventListener when fn is called
            return (fn.call(elem, window.event));
        });
    }
}

C_UTILS.prototype.EnableWebMessage = function (receiveWebMessageFunc) {
    this.addEvent(window, 'message', receiveWebMessageFunc);
}

C_UTILS.prototype.ReceiveWebMessage = function (e) {
    /*
    The properties of the dispatched message are:

    data: 
        The object passed from the other window.
    
    origin:
        The origin of the window that sent the message at the time 
        postMessage was called. Ej: http://example.net 
    
    source:
        A reference to the window object that sent the message; you can use this 
        to establish two-way communication between two windows with different 
        origins.
    */

    if (!(e.origin == "http://cbmex4.com" || e.origin == "http://cbmex7.com"))
        return;

    // data =>  {"origen":"xxx", "proceso":"yyy", "params":{...}}

    if (e.data.proceso == "SIGUE_VIVO") {
        var dataEnviar = { "origen": "VISOR", "proceso": "SIGUE_VIVO", "params": {} };
        event.source.postMessage(dataEnviar, event.origin);
    }
}

C_UTILS.prototype.SendWebMessage = function (obj, data, url) {
    // use JSON.stringify() and JSON.parse() to deal with
    // sending any kind of data structure that isn’t a string.
    // data =>  {"origen":"xxx", "proceso":"yyy", "params":{...}}
    // obj Iframe => document.getElementById("iframe_id").contentWindow
    // url => (targetOrigin) puede ser "*"

    obj = obj || parent;
    data = data || { "origen": "(Pryecto)", "proceso": "(Accion)", "params": { "msg": "Mensaje de prueba..." } };
    url = url || "*";
    obj.postMessage(data, url);
}

C_UTILS.prototype.openNewWin = function (url, winName, width, height) {
    var win = window.open(url, winName, 'height=' + height + ',width=' + width + ',left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
    return win;
}

C_UTILS.prototype.Espera = function (tit, txt) {
    this.FinEspera();
    dhtmlx.message({
        id: "msgEspera",
        type: "error",	// alert, alert-error, alert-warning, confirm, confirm-error, confirm-warning
        title: tit,
        text: txt,
        callback: function () { }
    });
}

C_UTILS.prototype.FinEspera = function() {
    dhtmlx.message.hide("msgEspera");
}

C_UTILS.prototype.Mensaje = function (tit, txt, tipo, confirmar, callbackFn) {
    // tipo: <b>: Normal   W: Warning   E: Error
    
    if (txt == "" || txt == null) {
        debugger;
    } else {
        var xType = (confirmar) ? "confirm" : "alert";
        if (tipo == "W")
            xType += "-warning";
        else if (tipo == "E")
            xType += "-error";

        var opts = {
            type: xType,
            title: tit,
            text: txt,
            ok: "Aceptar",
            cancel: "Cancelar",
            callback: function (OK) {
                if (callbackFn) callbackFn(OK);
            }
        };

        if (txt.length > 500) {
            opts.text = "<div style='height:400px;overflow:auto;text-align:left;background-color:#f9f9f9;'>" + txt + "</div>",
                opts.width = "1000px";
            opts.height = "500px";
        }

        dhtmlx.message(opts);
    }
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

UTILS = new C_UTILS();


/*
function User (theName, theEmail) {
    this.name = theName;
    this.email = theEmail;
    this.quizScores = [];
    this.currentScore = 0;
}
​
User.prototype = {
    constructor: User,
    saveScore:function (theScoreToAdd)  {
        this.quizScores.push(theScoreToAdd)
    },
    showNameAndScores:function ()  {
        var scores = this.quizScores.length > 0 ? this.quizScores.join(",") : "No Scores Yet";
        return this.name + " Scores: " + scores;
    },
    changeEmail:function (newEmail)  {
        this.email = newEmail;
        return "New Email Saved: " + this.email;
    }
}

firstUser = new User("Richard", "Richard@examnple.com"); 
firstUser.changeEmail("RichardB@examnple.com");
firstUser.saveScore(15);
firstUser.saveScore(10); 

*/

//NUEVAS FUNCIONES 

C_UTILS.prototype.blockkey = function () {
    var number = document.getElementsByName('number');
    for (var i = 0; i < number.length; i++) {
        number[i].onkeydown = function (e) {
            if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode > 36 && e.keyCode < 41 || e.keyCode == 49 || e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 17 || e.keyCode == 116 || e.keyCode == 9 || e.keyCode == 190 || e.keyCode == 110)) {
                return false;
            }
        }
    }
}

C_UTILS.prototype.OnError = function (result) {
    if (result.data != null && result.data != "") {
        var x = result.data.toString();
        if (x.includes("\r") || x.includes("\n") || x.includes("'")) {
            x = x.replace(/(\r\n|\n|\r|\')/gm, '');
        }
        UTILS.Mensaje(`<table style="width: 100%"><tr><td style="width: 60%; text-align: right">ERROR</td><td align="right"><img src="../images/information.png" style="width: 20px; height: 20px; cursor: pointer; position: relative; top: -10px" onclick="alert('${x}')" /></td></tr></table>`, result.mensaje, "E", false, function (OK) { });
    } else {
        UTILS.Mensaje("ERROR", result.mensaje, "E", false, function (OK) { });
    }
    closeWinEspera();
}


C_UTILS.prototype.FormatN = function (num) {
    if (parseFloat(num) == 0.00)
        num = 0;

    let part = num.toString().split('.');
    if (part.length > 1) {
        let dec = part[1];
        if (parseInt(dec) > 0)
            num = num;
        else
            num = part[0];
    }

    let res = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    if (!res.includes("."))
        res = res + ".00";

    return res;
}

C_UTILS.prototype.CloseWin = function () {
    wGasto.close();
}