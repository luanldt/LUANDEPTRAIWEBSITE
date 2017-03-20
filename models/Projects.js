/**
 * Created by nguyenminhluan on 3/19/17.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectSchema = new Schema({
    Name: String,
    Duration: {
        start: String,
        end: String
    },
    Position: String,
    Using: [String],
    Description: String,
    Images: [String],
    Show: Boolean
});

Project = mongoose.model("Projects", projectSchema);

module.exports = {
    /**
     * Create project
     * @param project
     * @returns {boolean}
     */
    create: function(project) {
        Project.create(project, function(err, project) {
            if (err)
                throw err;
        });
        return true;
    },
    /**
     * Find all project
     * @param perpage
     * @param page
     * @param callBack
     */
    find: function(perpage, page, callBack) {
        var currentPage = page - 1;
        Project.find().skip(perpage * currentPage).limit(perpage)
            .then(function(data){
                callBack(data);
            });
    },
    /**
     * Find one project
     * @param id
     * @param callBack
     */
    findOne: function(id, callBack) {
        Project.findOne({_id : id})
            .then(function(data) {
                callBack(data);
            });
    },
    /**
     * Count page project
     * @param perpage
     * @param callBack
     */
    count: function(perpage, callBack) {
        Project.find().count()
            .then(function(count) {
                callBack(Math.ceil(count/perpage));
            });
    },
    /**
     * Delete a project
     * @param id
     * @param callBack
     */
    delete: function(id, callBack) {
        Project.findOneAndRemove({ _id: id }, function(err, result) {
            callBack(result);
        });
    },
    update: function(id, project, callBack) {
        Project.findOneAndUpdate({_id: id}, project, function (err, result) {
            if (!err) {
                callBack(result);
            }
        });
    }
}