"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Article = /** @class */ (function () {
    function Article(title, category, tag, summary, content, archive, id, comments, authorId, likes, crtDate) {
        this.title = title;
        this.category = category;
        this.tag = tag;
        this.summary = summary;
        this.content = content;
        this.archive = archive;
        this.id = id;
        this.comments = comments;
        this.authorId = authorId;
        this.likes = likes;
        this.crtDate = crtDate;
        comments = null;
    }
    return Article;
}());
exports.Article = Article;
var ArticleModel = /** @class */ (function () {
    function ArticleModel(title, category, tag, summary, content, archive) {
        this.title = title;
        this.category = category;
        this.tag = tag;
        this.summary = summary;
        this.content = content;
        this.archive = archive;
    }
    return ArticleModel;
}());
exports.ArticleModel = ArticleModel;
//# sourceMappingURL=article.model.js.map