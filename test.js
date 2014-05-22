var marathon = null;

function square(x) { return x * x; };

$(document).ready(function ()
{
    marathon = new Race.Marathon();
    
    marathon.add(new Race({
        description: 'map',
        impls: {
            'jslinq.js': function (values) { return $linq(values).select(square).toArray(); },
            'lazy.js': function (values) { return Lazy(values).map(square).toArray(); },
            'underscore.js': function (values) { return _(values).map(square); }
        },
        inputs: [ { name: 'values', values: [Race.utils.integers(100)], size: 100 } ]
    }));
    
    
    
    marathon.start({
        complete: function (resultGroups)
        {
            var tbody = $('#results-body');            
            var tr = $('<tr>');            
            var results = resultGroups[0];
            var format = function (x) { return Benchmark.formatNumber(x.toFixed(0)); };
            
            $('<td>').text(results.race).appendTo(tr);
            $('<td>').text(format(results.results['jslinq.js'])).appendTo(tr);
            $('<td>').text(format(results.results['lazy.js'])).appendTo(tr);
            $('<td>').text(format(results.results['underscore.js'])).appendTo(tr);
            
            tbody.append(tr);
        }
    });
});

