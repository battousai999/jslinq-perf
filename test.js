var marathon = null;

function square(x) { return x * x; }
function isEven(x) { return x % 2 === 0; }
function getIntArray(size) { return $linq(Race.utils.integers(size)).select('x => x + 1').toArray(); }
function isArray(obj) { return (Object.prototype.toString.call(obj) === '[object Array]'); }

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

$(document).ready(function ()
{
    marathon = new Race.Marathon();
    
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

