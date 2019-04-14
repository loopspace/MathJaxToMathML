
function init() {
    MathJax.Hub.Config({
	extensions: ["tex2jax.js", "toMathML.js"],
	jax: ["input/TeX", "output/HTML-CSS"],
	tex2jax: {
	    inlineMath: [["$","$"],["\\(","\\)"]],
	    ignoreClass: "no-mathjax",
	    processClass: "do-mathjax"
	},
    });
    MathJax.Hub.Queue(resettex);
}

window.addEventListener('load', init);

function toMathML(jax,callback) {
    var mml;
    try {
	mml = jax.root.toMathML("");
    } catch(err) {
	if (!err.restart) {throw err} // an actual error
	return MathJax.Callback.After([toMathML,jax,callback],err.restart);
    }
    MathJax.Callback(callback)(mml);
}

function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

function resettex() {
    var tbox = document.getElementById("tex");
    var tex = tbox.value;
    var texp = document.getElementById("texoutput");
    texp.innerHTML = tex;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,texp]);

    MathJax.Hub.Queue(
	function () {
	    var jax = MathJax.Hub.getAllJax();
	    var txt = "";
	    var elt = document.getElementById("mmloutput");
	    elt.innerHTML = '';
	    for (var i = 0; i < jax.length; i++) {
		toMathML(jax[i],function (mml) {
		    var tr = document.createElement('tr');
		    var td = document.createElement('td');
		    var code = document.createElement('code');
		    var telt = document.createTextNode(jax[i].originalText);
		    code.appendChild(telt);
		    td.appendChild(code);
		    td.classList.add('first-column');
		    tr.appendChild(td);
		    
		    var td = document.createElement('td');
		    var code = document.createElement('code');
		    var telt = document.createTextNode(mml);
		    td.onclick = function(e) {
			selectElementText(telt);
		    };

		    code.appendChild(telt);
		    td.appendChild(code);
		    tr.appendChild(td);

		    elt.appendChild(tr);
		});
	    }
	}
    );

}
