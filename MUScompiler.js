var endTime = function(expr) {
    var time = 0;
    var searcher = function(expr) {
        if (expr.tag === 'note') {
            return expr.dur;
        } else if (expr.tag === 'seq') {
            time += searcher(expr.left);
            time += searcher(expr.right);
        } else if (expr.tag === 'par') {
            var time1 = searcher(expr.left);
            var time2 = searcher(expr.right);
            if (time1 > time2) {
                time += time1;
            } else {
                time += time2;
            }
        }
    };
    searcher(expr);
    return time;
};

var compile = function(expr) {
    note = [];
    var compiler = function(start, mus) {
        mus.start = start || 0;
        if (mus.tag === 'note') {
            mus.start = start;
            note.push(mus);
        } else {
            compiler(start, mus.left);
            compiler(start + endTime(mus.left), mus.right);
        }
    };
    compiler(0, expr);
    return note;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));