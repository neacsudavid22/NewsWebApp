import Article from '../models/Article.js';

const getArticles = async (filterCategory) => {
    try{
        const articles = filterCategory ? await Article.where("category").equals(filterCategory).exec()
                                        : await Article.find().exec() 
        if (articles.length === 0) {
            return { error: true, message: "No articles found" };
        }
        return articles;
    }
    catch (err) {
        console.error(`getArticles Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const getArticleById = async (id) => {
    try{
        const article = await Article.findById(id)
        if(!article){
            return { error: true, message: "Article not found" };
        }
        return article
    }
    catch (err) {
        console.error(`getArticleById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const createArticle = async (article) => {
    try{
        const newArticle = await Article.create(article)
        if(!newArticle){
            return { error: true, message: "Error creating article" };
        }
        return newArticle;
    }
    catch (err) {
        console.error(`createArticle Error: ${err.message}`);
        process.exit(1);
    }
}

const deleteArticle = async (id) => {
    try{
        const deletedArticle = await Article.deleteOne({_id: id})
        if(!deletedArticle){
            return { error: true, message: "Error deleting article" };
        }
        return deletedArticle;
    }
    catch (err) {
        console.error(`deleteArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const updateArticle = async (id, article) => {
    try{
        const updatedArticle = await  Article.updateOne({_id: id}, article)
        if(!updatedArticle){
            return { error: true, message: "Error updating article" };
        }
        return updatedArticle;
    }
    catch (err) {
        console.error(`updateArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

export {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle
}