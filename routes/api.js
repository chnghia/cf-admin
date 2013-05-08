/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

exports.users = function (req, res) {
	var data = [
    {id: "id-1", first: "first 1", last: "last 1", username: "username1"},
    {id: "id-2", first: "first 2", last: "last 2", username: "username2"},
    {id: "id-3", first: "first 3", last: "last 3", username: "username3"},
    {id: "id-4", first: "first 4", last: "last 4", username: "username4"},
    {id: "id-5", first: "first 5", last: "last 5", username: "username5"},
    {id: "id-6", first: "first 6", last: "last 6", username: "username6"},
    {id: "id-7", first: "first 7", last: "last 7", username: "username7"},
    {id: "id-8", first: "first 8", last: "last 8", username: "username8"},
    {id: "id-9", first: "first 9", last: "last 9", username: "username9"},
    {id: "id-10", first: "first 10", last: "last 10", username: "username10"},
    {id: "id-11", first: "first 11", last: "last 11", username: "username11"},
    {id: "id-12", first: "first 12", last: "last 12", username: "username12"},
    {id: "id-13", first: "first 13", last: "last 13", username: "username13"},
    {id: "id-14", first: "first 14", last: "last 14", username: "username14"},
    {id: "id-15", first: "first 15", last: "last 15", username: "username15"},
    {id: "id-16", first: "first 16", last: "last 16", username: "username16"},
    {id: "id-17", first: "first 17", last: "last 17", username: "username17"},
    {id: "id-18", first: "first 18", last: "last 18", username: "username18"},
    {id: "id-19", first: "first 19", last: "last 19", username: "username19"},
    {id: "id-20", first: "first 20", last: "last 20", username: "username20"},
    {id: "id-21", first: "first 21", last: "last 21", username: "username21"},
    {id: "id-22", first: "first 22", last: "last 22", username: "username22"},
    {id: "id-23", first: "first 23", last: "last 23", username: "username23"},
    {id: "id-24", first: "first 24", last: "last 24", username: "username24"},
    {id: "id-25", first: "first 25", last: "last 25", username: "username25"},
    {id: "id-26", first: "first 26", last: "last 26", username: "username26"},
  ];

  if (req.query.q != 'undefined')
  {
    var out = data.filter(function (x) {
      return x.id.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1;
    });
    //console.log(req.query.start + "  " + req.query.limit);

    //res.json(data.slice(req.query.start, req.query.limit));
    res.json(out);
  }
  else
    res.json(data);
}