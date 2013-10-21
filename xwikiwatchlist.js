
function makeCORSRequest( wikiapi, params, callback ) {
	params.format = 'json';
	params.origin = 'https://www.wikidata.org';
	$.ajax( {
		'url': wikiapi,
		'data': params,
		'xhrFields': {
			'withCredentials': true
		},
		'success': callback,
		'dataType': 'json'
	} );
}

function getWatchlist() {
	var url, params, cur;
	url = 'https://en.wikipedia.org/w/api.php';
	params = {
		action: 'query',
		list: 'watchlist',
		wlprop: 'title|ids|sizes|timestamp|user|parsedcomment',
		wltype: 'edit'
	};
	makeCORSRequest( url, params, function ( data ) {
		outputList( data );
		cur = mw.config.get('wgWatchlist');
		if ( cur == undefined ) {
			cur = {};
		}
		$.merge( cur, {'enwiki': data} );
		mw.config.set('wgWatchlist', cur );

	} )
}

function makeRow( stuff ) {
	return $('<li></li>')
		.append('( ')
		.append(
			$('<a></a>')
				.attr('href', 'https://en.wikipedia.org/?diff=' + stuff.revid)
				.text('diff')
		)
		.append( ' | ')
		.append(
			$('<a></a>')
				.attr('href', 'https://en.wikipedia.org/?action=history&curid=' + stuff.pageid)
				.text('hist')
		)
		.append( ' ) .. ' )
		.append(
			$('<a></a>')
				.attr('href', 'https://en.wikipedia.org/wiki/' + encodeURIComponent( stuff.title ) )
				.text( stuff.title )
		)
		// FIXME: make timestamp pretty
		// FIXME: add diff size
		.append( '; ' + stuff.timestamp + ' .. ')
		.append(
			$('<a></a>')
				.attr('href', 'https://en.wikipedia.org/wiki/User:' + encodeURIComponent( stuff.user ) )
				.text( stuff.user )
		)
		.append(
			$('<span></span>')
				.addClass('editsummary')
				.html( stuff.parsedcomment )
		);
}

function outputList( queryresult ) {
	var ul = $('<ul></ul>');
	$.each( queryresult.query.watchlist, function( index, value ) {
		ul.append( makeRow( value ) );
	} );
	var thing = $('#thing');
	thing.text('');
	thing.append( ul );
}