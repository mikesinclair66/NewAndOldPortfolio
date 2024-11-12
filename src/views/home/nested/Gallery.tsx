import Anim from "../../../components/anim/Anim";
import React, { ReactNode } from "react";

interface GalleryProps {
    categoryFilter: number;
    platformFilter: number;
    sizeFilter: number;
}

const Legend: React.FC<GalleryProps> = ({ categoryFilter, platformFilter, sizeFilter }) => {
    const projects = {
        "25/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 0,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "24/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 1,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "23/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 2,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "22/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 3,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "21/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 4,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "20/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 5,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "19/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 6,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "18/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 7,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "17/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 8,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "16/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 9,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        },

        "15/10/24": {
            title: "The Website Club",
            type: 1, 
            platform: 1,
            size: 3,
            key: 10,

            caption: "Better than Figma \u{1F609}!!",
            desc: "Ever heard of Figma? This wireframe designer uses an effective UI to build not only"
            + " the wireframe, but the proposed website itself.",
            subDesc: "Project currently only exports code repositories in Vue 3.",
            thumb: "/graphics/shark.jpeg"
        }
    };

    let iconSrc = "/graphics/legend/";
    let list: ReactNode[] = [];
    for(let [key, val] of Object.entries(projects)){
        let icons: ReactNode[] = [];
        let fileName: string = "";
        let fileAlt: string = "";

        switch(val.type){
            case 1:
                fileName = "gear";
                fileAlt = "Software Engineering";
                break;
            case 2:
                fileName = "java";
                fileAlt = "Software Development";
                break;
            case 3:
                fileName = "game_controller";
                fileAlt = "Game Development";
                break;
        }
        if(val.type == 1 || val.type == 2)
            icons.push(<img className="filter-icon" src={`${iconSrc}${fileName}.png`} alt={fileAlt} key={`type-${val.key}`} />);

        switch(val.platform){
            case 1:
                fileName = "web";
                fileAlt = "Web";
                break;
            case 2:
                fileName = "desktop";
                fileAlt = "Desktop";
                break;
            case 3:
                fileName = "mobile";
                fileAlt = "Mobile";
                break;
        }
        if(val.type == 1 || val.type == 2 || val.type == 3)
            icons.push(<img className="filter-icon" src={`${iconSrc}${fileName}.png`} alt={fileAlt} key={`platform-${val.key}`} />);

        list.push(<div className="pl-card" key={val.key}>
            <div className="thumbnail">
                <img className="thumbnail" src={val.thumb} alt={val.title} />
            </div>
            <div className="pl-card-info align-left">
                <div className="plci-left">
                    <div className="plci-header">{ val.title }</div>
                    <div className="plci-caption">{ val.caption }</div>
                </div>
                <div className="plci-right">
                    <div className="plci-right-inner align-right">
                        { icons }
                    </div>
                    <div className="project-size-bars align-right">
                        <div className={`psb-${val.size >= 1 ? '' : 'in'}active`}></div>
                        <div className={`psb-${val.size >= 2 ? '' : 'in'}active`}></div>
                        <div className={`psb-${val.size >= 3 ? '' : 'in'}active`}></div>
                    </div>
                </div>
            </div>
        </div>);
    }

    return (
        <div id="pl-gallery">
            { list }
        </div>
    );
}

export default Legend;