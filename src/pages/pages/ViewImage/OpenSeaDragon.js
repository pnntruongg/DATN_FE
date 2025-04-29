import React, { useState, useEffect } from 'react'
import OpenSeadragon from "openseadragon";
import "./ViewImage.scss"
export default function OpenSeaDragon(props) {
    const [view, setView] = useState()
    const initOpenSeaDragon = () => {
        view && view.destroy();
        setView(
            OpenSeadragon({
                id: "slide",
                prefixUrl: "//openseadragon.github.io/openseadragon/images/",
                tileSources: {
                    Image: {
                        xmlns: "https://schemas.microsoft.com/deepzoom/2008",
                        Url: `http://localhost:5001/image/users/${props.image.users[0].email}/${props.image.album.name}/${props.image && props.image.nameUrl}/${props.image && props.image.nameUrl}_files/`,
                        Format: "jpeg",
                        Overlap: "2",
                        TileSize: "256",
                        Size: {
                            Width: `${props.image.width && props.image.width}`,
                            Height: ` ${props.image.height && props.image.height}`,
                        },
                    },
                },
                smoothTileEdgesMinZoom: 1,
                animationTime: 1,
                opacity: 1,
                blendTime: 0.1,
                constrainDuringPan: true,
                maxZoomPixelRatio: 2,
                minZoomLevel: 1,
                visibilityRatio: 1,
                zoomPerScroll: 2
            })
        )

    }

    useEffect(() => {
        props.image && initOpenSeaDragon()
        return () => {
            view && view.destroy();
        }
    }, [props.image]);

    return (
        <div>
            <div id="slide"></div>
        </div>
    )
}
