var listModel = require('../models/listModel');
var itemCtrl = require('./itemCtrl');
var userCtrl = require('./userCtrl');

module.exports = {
	// return an existing list or create a new one
	findOrCreate: function(req, res){	
		listModel.findOne({'name':req.name, 'user_id': req.user_id}, function(err, found){
			if(!res) {
				return;
			}
			if(err){
				return err;
			} else{
				if(found){
					hold = found.items;
					if(res) return res.send(JSON.stringify(found));
				}else{
					var list = new listModel({
						user_id: req.user_id,
						created: new Date(),
						name: req.name,
						items: []
					});
					userCtrl.addList({list_id: req.name, user_id: req.user_id});
					list.save(function(err, newlist){
						if(err) return err;
						if(res) return res.send(JSON.stringify(newlist));
					});	
				}
			}
			
		});
	},
	// add an item to the list
	addItem: function(req, res){
		this.findOrCreate({'name':req.name, 'user_id': req.user_id}, res);
		listModel.findOne({'name':req.name, 'user_id': req.user_id}, function(err, found){
			if(err){
				return null;
			}else{
				if(found){
					found.items.push(req.api_id);
					found.save();
				}
			}
		});
	},
	// return all lists for a user
	showAllLists: function(req, res){
		listModel.find({'user_id': req.user_id}, function(err, lists){
			var allLists = {}
			lists.forEach(function(list){
				allLists[list._id] = list.items;
			});
			res.send(JSON.stringify(allLists));
		});
	},
	// delete a list
	delete: function(req,res){
		listModel.remove({
			'name' : req.name,
			'user_id': req.user_id
		}, function(err, list){
			if(err){
				return null;
			}
			return list;
		});
	}
};