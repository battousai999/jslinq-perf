var marathon = null;

function identity(x) { return x; }
function square(x) { return x * x; }
function isEven(x) { return x % 2 === 0; }
function increment(x) { return x + 1; }
function getIntArray(size) { return $linq(Race.utils.integers(size)).select('x => x + 1').toArray(); }
function isArray(obj) { return (Object.prototype.toString.call(obj) === '[object Array]'); }
function mergeZip(x, y) { return [x, y]; }

var jaggedArray = [[1, 2, 3],[[4, 5, 6],[7, 8, 9],[[10, 11],12],13,14,[15, 16],17],[18,19,20,[21, 22]],[23, 24, 25],26,27,28,[29, 30],[[31, 32, 33],[34, 35]],36];

var arraySize = 100;

function myFlatten(values)
{
    var helper = function (x)
    {
        if (isArray(x))
            return $linq(x).selectMany(helper).toArray();
        else
            return [x];
    };

    return $linq(values).selectMany(helper).toArray();
}

function myFlattenAndIncrement(values)
{
    var helper = function (x)
    {
        if (isArray(x))
            return $linq(x).selectMany(helper).toArray();
        else
            return [x];
    };

    return $linq(values).selectMany(helper, increment).toArray();
}

function arr(from, to) {
    return Lazy.range(from, to).toArray();
}

function dupes(min, max, count) {
    var numbers = Lazy.generate(function() {
        return Math.floor((Math.random() * (max - min)) + min);
    });
    return numbers.take(count).toArray();
}

function round(num)
{
    return num.toFixed(0);
}

$(document).ready(function ()
{
    marathon = new Race.Marathon();
    /*
    marathon.add(new Race({
        description: 'map',
        impls: {
            'jslinq.js': function (values) { return $linq(values).select(square).toArray(); },
            'lazy.js': function (values) { return Lazy(values).map(square).toArray(); },
            'underscore.js': function (values) { return _(values).map(square); },
            'linq.js': function (values) { return Enumerable.From(values).Select(square).ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Select(square).ToArray(); },
            'from.js': function (values) { return from(values).select(square).toArray(); }
        },
        inputs: [ { name: 'values', values: [getIntArray(arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'filter',
        impls: {
            'jslinq.js': function (values) { return $linq(values).where(isEven).toArray(); },
            'lazy.js': function (values) { return Lazy(values).filter(isEven).toArray(); },
            'underscore.js': function (values) { return _(values).filter(isEven); },
            'linq.js': function (values) { return Enumerable.From(values).Where(isEven).ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Where(isEven).ToArray(); },
            'from.js': function (values) { return from(values).where(isEven).toArray(); }
        },
        inputs: [ { name: 'values', values: [getIntArray(arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'flatten',
        impls: {
            'jslinq.js': function (values) { return myFlatten(values); },
            'lazy.js': function (values) { return Lazy(values).flatten().toArray(); },
            'underscore.js': function (values) { return _(values).flatten(); },
            'linq.js': function (values) { return Enumerable.From(values).Flatten().ToArray(); }            
        },
        inputs: [ { name: 'values', values: [jaggedArray], size: 10 } ]
    }));
    
    marathon.add(new Race({
        description: 'distinct (mostly duplicates)',
        impls: {
            'jslinq.js': function (values) { return $linq(values).distinct().toArray(); },
            'lazy.js': function (values) { return Lazy(values).uniq().toArray(); },
            'underscore.js': function (values) { return _(values).uniq(); },
            'linq.js': function (values) { return Enumerable.From(values).Distinct().ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Distinct(identity).ToArray(); },
            'from.js': function (values) { return from(values).distinct().toArray(); }
        },
        inputs: [ { name: 'values', values: [dupes(0, round(arraySize * 0.1), arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'distinct (about half duplicates)',
        impls: {
            'jslinq.js': function (values) { return $linq(values).distinct().toArray(); },
            'lazy.js': function (values) { return Lazy(values).uniq().toArray(); },
            'underscore.js': function (values) { return _(values).uniq(); },
            'linq.js': function (values) { return Enumerable.From(values).Distinct().ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Distinct(identity).ToArray(); },
            'from.js': function (values) { return from(values).distinct().toArray(); }
        },
        inputs: [ { name: 'values', values: [dupes(0, round(arraySize * 0.5), arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'distinct (mostly uniques)',
        impls: {
            'jslinq.js': function (values) { return $linq(values).distinct().toArray(); },
            'lazy.js': function (values) { return Lazy(values).uniq().toArray(); },
            'underscore.js': function (values) { return _(values).uniq(); },
            'linq.js': function (values) { return Enumerable.From(values).Distinct().ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Distinct(identity).ToArray(); },
            'from.js': function (values) { return from(values).distinct().toArray(); }
        },
        inputs: [ { name: 'values', values: [dupes(0, arraySize, arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'union',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).union(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).union(second).toArray(); },
            'underscore.js': function (first, second) { return _.union(first, second); },
            'linq.js': function (first, second) { return Enumerable.From(first).Union(second).ToArray(); },
            'from.js': function (first, second) { return from(first).union(second).toArray(); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'intersection',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).intersect(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).intersection(second).toArray(); },
            'underscore.js': function (first, second) { return _.intersection(first, second); },
            'linq.js': function (first, second) { return Enumerable.From(first).Intersect(second).ToArray(); },
            'JSLINQ': function (first, second) { return JSLINQ(first).Intersect(second).ToArray(); },
            'from.js': function (first, second) { return from(first).intersect(second).toArray(); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'zip',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).zip(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).zip(second).toArray(); },
            'underscore.js': function (first, second) { return _(first).zip(second); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'map * filter',
        impls: {
            'jslinq.js': function (values) { return $linq(values).select(increment).where(isEven).toArray(); },
            'lazy.js': function (values) { return Lazy(values).map(increment).filter(isEven).toArray(); },
            'underscore.js': function (values) { return _.chain(values).map(increment).filter(isEven); },
            'linq.js': function (values) { return Enumerable.From(values).Select(increment).Where(isEven).ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Select(increment).Where(isEven).ToArray(); },
            'from.js': function (values) { return from(values).select(increment).where(isEven).toArray(); }
        },
        inputs: [ { name: 'values', values: [getIntArray(arraySize)], size: arraySize } ]        
    }));
    
    marathon.add(new Race({
        description: 'flatten * map',
        impls: {
            'jslinq.js': function (values) { return myFlattenAndIncrement(values); },
            'lazy.js': function (values) { return Lazy(values).flatten().map(increment).toArray(); },
            'underscore.js': function (values) { return _.chain(values).flatten().map(increment).value(); },
            'linq.js': function (values) { return Enumerable.From(values).Flatten().Select(increment).ToArray(); }            
        },
        inputs: [ { name: 'values', values: [jaggedArray], size: 10 } ]
    }));
    
    marathon.add(new Race({
        description: 'map * distinct',
        impls: {
            'jslinq.js': function (values) { return $linq(values).select(increment).distinct().toArray(); },
            'lazy.js': function (values) { return Lazy(values).map(increment).uniq().toArray(); },
            'underscore.js': function (values) { return _.chain(values).map(increment).uniq().value(); },
            'linq.js': function (values) { return Enumerable.From(values).Select(increment).Distinct().ToArray(); },
            'JSLINQ': function (values) { return JSLINQ(values).Select(increment).Distinct(identity).ToArray(); },
            'from.js': function (values) { return from(values).select(increment).distinct().toArray(); }
        },
        inputs: [ { name: 'values', values: [dupes(0, round(arraySize * 0.5), arraySize)], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'map * union',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).select(increment).union(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).map(increment).union(second).toArray(); },
            'underscore.js': function (first, second) { return _.chain(first).map(increment).union(second).value(); },
            'linq.js': function (first, second) { return Enumerable.From(first).Select(increment).Union(second).ToArray(); },
            'from.js': function (first, second) { return from(first).select(increment).union(second).toArray(); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    
    marathon.add(new Race({
        description: 'map * intersection',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).select(increment).intersect(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).map(increment).intersection(second).toArray(); },
            'underscore.js': function (first, second) { return _.chain(first).map(increment).intersection(second).value(); },
            'linq.js': function (first, second) { return Enumerable.From(first).Select(increment).Intersect(second).ToArray(); },
            'JSLINQ': function (first, second) { return JSLINQ(first).Select(increment).Intersect(second).ToArray(); },
            'from.js': function (first, second) { return from(first).select(increment).intersect(second).toArray(); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    */
    marathon.add(new Race({
        description: 'map * zip',
        impls: {
            'jslinq.js': function (first, second) { return $linq(first).select(increment).zip(second).toArray(); },
            'lazy.js': function (first, second) { return Lazy(first).map(increment).zip(second).toArray(); },
            'underscore.js': function (first, second) { return _.chain(first).map(increment).zip(second).value(); }
        },
        inputs: [ { name: 'values', values: [arr(0, arraySize), arr(round(arraySize * 0.5), round(arraySize * 1.5))], size: arraySize } ]
    }));
    
    marathon.start({
        complete: function (resultGroups)
        {
            var tbody = $('#results-body');            
            var tr = $('<tr>');            
            var results = resultGroups[0];
            var format = function (x) { return Benchmark.formatNumber(x.toFixed(0)); };
            
            var val = function (name) 
            {
                if (results.results[name] === undefined)
                    return 'n/a';
                else
                    return format(results.results[name]);
            };
            
            $('<td>').text(results.race).appendTo(tr);
            $('<td>').text(val('jslinq.js')).appendTo(tr);
            $('<td>').text(val('lazy.js')).appendTo(tr);
            $('<td>').text(val('underscore.js')).appendTo(tr);            
            $('<td>').text(val('linq.js')).appendTo(tr);            
            $('<td>').text(val('JSLINQ')).appendTo(tr);            
            $('<td>').text(val('from.js')).appendTo(tr);            
            
            tbody.append(tr);
        },
        
        mismatch: function (x)
        {
            alert(x);
        }
    });
});

