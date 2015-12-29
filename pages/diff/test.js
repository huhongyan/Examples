/**
 * Created by Administrator on 2015/11/17.
 */
function diffUsingJS(viewType) {
    // get the baseText and newText values from the two textboxes, and split them into lines
    var $ = function (id) { return document.getElementById(id); };
    var base = difflib.stringAsLines($("baseText").value);
    var newtxt = difflib.stringAsLines($("newText").value);

    // create a SequenceMatcher instance that diffs the two sets of lines
    var sm = new difflib.SequenceMatcher(base, newtxt);

    // get the opcodes from the SequenceMatcher instance
    // opcodes is a list of 3-tuples describing what changes should be made to the base text
    // in order to yield the new text
    var opcodes = sm.get_opcodes();
    var diffoutputdiv = $("diffoutput");
    while (diffoutputdiv.firstChild) diffoutputdiv.removeChild(diffoutputdiv.firstChild);
    //var contextSize = $("contextSize").value;
    //contextSize = contextSize ? contextSize : null;

    // build the diff view and add it to the current DOM
    diffoutputdiv.appendChild(diffview.buildView({
        baseTextLines: base,
        newTextLines: newtxt,
        opcodes: opcodes,
        // set the display titles for each resource
        baseTextName: "Base Text",
        newTextName: "New Text",
        //contextSize: contextSize,
        //viewType: $("inline").checked ? 1 : 0
        viewType: viewType
    }));

    // scroll down to the diff view window.
   // location = url + "#diff";
}