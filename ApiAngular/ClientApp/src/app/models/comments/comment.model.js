"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Comment = /** @class */ (function () {
    function Comment(name, text, email, approved, id, articleId, replyComments, article) {
        this.name = name;
        this.text = text;
        this.email = email;
        this.approved = approved;
        this.id = id;
        this.articleId = articleId;
        this.replyComments = replyComments;
        this.article = article;
        replyComments = [];
        article = null;
    }
    return Comment;
}());
exports.Comment = Comment;
//# sourceMappingURL=comment.model.js.map