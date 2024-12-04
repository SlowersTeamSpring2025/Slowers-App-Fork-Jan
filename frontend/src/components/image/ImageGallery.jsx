import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "react-bootstrap"
import Masonry from "react-masonry-css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import './ImageGallery.css'

const ImageGallery = ({ isGrower, images, deleteImage, favoriteImage, type }) => {
  const { t } = useTranslation() 
	const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState(null)

	useEffect(()=> {
		const favIdx = images.findIndex((img) => img?.favorite)
		setSelectedFavoriteIndex(favIdx)
	},[images])
	
	const handleFavoriteSelect = (imageObject) => {
		favoriteImage(imageObject)
	}
	const breakpointColumnsObj = {default: 3, 991: 2, 550: 1,};

  return (
    <div className="m-2">
			{(!images || images.length === 0) ? (
        <p>
				{type === "flower"
					? t('image.noflowerimages')
					: t('image.nositeimages')}
				</p>
			) : (
				<div>
					<Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
						{images.map((image, index) => (
						<div className="image-box" key={image._id || index}>
							<img src={image.url}/>
							{isGrower && (
							<div className="image-buttons">
								<Button variant="dark" onClick={() => deleteImage(image)} className="delete-button" aria-label="Delete">
									<i className="bi bi-trash"></i>
								</Button>
								<Button variant="dark" onClick={() => handleFavoriteSelect(image)} className={`favourite-button ${selectedFavoriteIndex === index ? "selected" : ""}`} disabled={selectedFavoriteIndex !== null && selectedFavoriteIndex == index} aria-label="Favorite">
									<i className={`bi bi-star-fill ${selectedFavoriteIndex === index ? "text-warning" : ""}`}></i>
								</Button>
							</div>
							)}
						</div>
						))}
					</Masonry>
				</div>
			)}
    </div>
  )
}

export default ImageGallery
