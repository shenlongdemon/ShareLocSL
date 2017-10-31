import React from 'react';

export default class Geometry extends React.Component {

    constructor(props) {
        super(props);
    }
    /**
     * 
     * @param {*} fromCoor 
     * @param {*} toCoor 
     */
    static getMiddle(fromCoor, toCoor){
        return {
            latitude: (fromCoor.latitude + toCoor.latitude) / 2,
            longitude: (fromCoor.longitude + toCoor.longitude) / 2
        };
    }
   
}