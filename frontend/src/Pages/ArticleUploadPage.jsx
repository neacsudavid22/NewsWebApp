import { useLocation } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/esm/Stack";
import Image from "react-bootstrap/Image";
import { useContext, useState } from "react";
import "./ArticleUploadPage.css";
import { AuthContext } from "../Components/AuthProvider";
import MainNavbar from "../Components/MainNavBar";
import { postArticle } from "../Services/articleService";

const ArticleUploadPage = () => {
    const location = useLocation();
    const state = location.state || {}; 
    const articleContent = state.articleContent || [];
    const articleImages = state.articleImages || [];
    const title = state.title || "";
    const [category, setCategory] = useState("politics")
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState(""); 
    const [tagSelect, setTagSelect] = useState(""); 
    const author = useContext(AuthContext).user;
    const [background, setBackground] = useState();
    const [backgroundPreview, setBackgroundPreview] = useState();

    const uploadImages = async () => {
        const formData = new FormData();

        formData.append("images", background);
        articleImages.forEach((file) => {
            formData.append("images", file);
        });
    
        try {
            const response = await fetch("http://localhost:3600/upload-api/upload-images", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) throw new Error("Image upload failed");
    
            const data = await response.json(); // Expecting an array of URLs
            return data.imageUrls; // Return array of uploaded image URLs
        } catch (error) {
            console.error("Error uploading images:", error);
            return [];
        }
    };
    
    const handlePublish = async () => {
        const uploadedImageUrls = await uploadImages();
    
        if (uploadedImageUrls.length !== (articleImages.length + 1)) {
            console.error("Some images failed to upload");
            return;
        }
    
        // Replace temp URLs with real URLs
        let imgIndex = 0;
        const backgroundUrl = uploadedImageUrls[imgIndex++]
        const updatedContent = articleContent.map((item) => {
            if (item.contentType === "Image") {
                return { contentType: item.contentType, content: uploadedImageUrls[imgIndex++]}
            }
            return item;
        });
    
        const article = { title, author: author._id, articleContent: updatedContent, category, tags, background: backgroundUrl };

        const result = await postArticle(article);
        console.log("Article created:", result);
    };

    const removeTag = () => {
        if (tags.includes(tagSelect)) { 
            const currentTags = [...tags]
            currentTags.splice(currentTags.indexOf(tagSelect), 1)
            setTags(currentTags);
            setTagSelect(""); 
        }
    }

    const addTag = () => {
        if (tagInput.trim() !== "" && !tags.includes(tagInput)) { 
            setTags([...tags, tagInput]);
            setTagInput(""); 
        }
    }

    return (
        <>
        <MainNavbar/>
        <Container fluid className="h-100 mt-4">
        <Row className="w-100 justify-content-center">
        <Col sm={12} md={10} lg={8} xl={6} className=" h-100"> {/* Responsive form width */}

            <h1 className="mb-4">Article Preview</h1>
            <Stack sm={12} md={10} lg={8} xl={6} direction="vertical" gap={2} className="border p-3 overflow-y-auto h-75 mb-4">
                <h1>{title}</h1>
                { articleContent.map( (item, index) => {
                    const Tag = item.contentType
                        return (
                            <>
                                {
                                item.contentType === "Image" ? 
                                    <div key={index} className="d-flex justify-content-center">
                                        <Image src={item.content} alt="Article Image" thumbnail className="w-75 p-2 my-3" /> 
                                    </div>
                                    :
                                    <div key={index} className="d-flex justify-content-start">
                                        <Tag className="p-2 my-2">{item.content}</Tag>
                                    </div>
                                }
                            </>
                        );
                    })
                }
            </Stack>

            <Stack direction="verical" className="d-flex justify-content-center border-top py-3 mb-1" gap={3} >
                <Form.Group className="w-75 mb-3 pe-5">
                    <Form.Label><b>Background</b></Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={ (e) => {
                            setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
                            setBackground(e.target.files[0])
                        } }
                    />
                </Form.Group>

                { backgroundPreview && <Image src={backgroundPreview} thumbnail fluid className="w-75 p-2" /> }
   
            </Stack>

            <Form.Select aria-label="Category" onChange={(e) => setCategory(e.target.value)} className="w-50">
                <option value="politics">politics</option>
                <option value="extern">extern</option>
                <option value="finance">finance</option>
                <option value="sports">sports</option>
                <option value="tech">tech</option>
                <option value="lifestyle">lifestyle</option>
            </Form.Select>

            <Stack direction="horizontal" className="mt-4 mb-3" gap={3}>
                <Form.Control
                    type="text" 
                    placeholder="add tags" 
                    className="w-50" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                /> 
                <Button type="button" variant="primary" onClick={ () => addTag() }>Add</Button>
                <Button type="button" variant="danger" onClick={ () => removeTag() }>Remove</Button>
            </Stack>

            <Tabs
                variant="pills"
                id="justify-tab-example"
                className="mb-3 nav-pills"
                onSelect={(e) => setTagSelect(e)}
                onDoubleClick={ () => removeTag() }
            > {tags.map((tag) => <Tab className="m-2" eventKey={tag} title={tag}></Tab>)}
            </Tabs>
            
            <Button variant="success" type="button" className="mb-5" onClick={handlePublish}>
                Publish Article
            </Button>
     
        </Col>
        </Row>
        </Container>
        </>
    );
}

export default ArticleUploadPage