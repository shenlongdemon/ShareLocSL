// open shake menu : adb shell input keyevent 82
import React, { Component } from 'react';
import BaseScreen from './basescreen';
//import MapView from 'react-native-map-clustering';
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
import KeyGen from '../functions/keygen'
import Geometry from '../functions/geometry'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
const MAX_INDEX_DIRECTION = 1000000;
const MIN_INDEX_DIRECTION = 0;
export default class MainScreen extends BaseScreen {
    static navigationOptions = {
        title: 'Main',
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: 'red',
        },
        header: null
    };
    constructor(props) {
        super(props);
        console.log("constructor main");
        this.getCurrentPosition();
        this.state = {
            directions:[],
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        };
    }
    getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("getCurrentPosition");
                var initialPosition = JSON.stringify(position);

            },
            (error) => console.log("getCurrentPosition " + error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log("watchPosition");
                var initialPosition = JSON.stringify(position);

            },
            (error) => console.log("watchPosition " + error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );
    }


    onMapPress(e) {
        // alert("onMapPress");
        this.addDirection( e.nativeEvent.coordinate);        
    }
    createDirection(coordinate){
        var key = KeyGen.uuid_v4();
        var direction = { 
            isModified: true,
            coordinate: coordinate,
            index: MIN_INDEX_DIRECTION,
            title: "",
            description: "",
            key : key,
            id: key
        };
        return direction;
    }
    addDirection(coordinate){

        var direction = this.createDirection(coordinate);
        if (this.state.directions == undefined){
            this.state.directions = [];
        }
        if (this.state.directions.length == 0){
            direction.title = "start";
            direction.description = "start - source";
            this.setState({
                directions: [                    
                    direction
                ],
            });
        }
        else if (this.state.directions.length == 1){
            direction.title = "end";
            direction.description = "end - destination";
            direction.index = MAX_INDEX_DIRECTION;
            var middleCoor = Geometry.getMiddle(this.state.directions[0].coordinate, coordinate);
            var middle = this.createDirection(middleCoor);
            middle.isModified = false;
            middle.index = parseInt(direction.index / 2);
            middle.title = "mid " + middle.index;
            middle.description = "mid - " + this.state.directions[0].key + " - " + direction.key;           
            this.setState({
                directions:  [...this.state.directions,
                    middle,
                    direction]
            });
        }
    }
    getPreviousDirections(index){
        var previous =  this.state.directions.filter(item => item.index < index);
        return previous;
    }
    getNextDirections(index){
        var next =  this.state.directions.filter(item => item.index > index);
        return next;
    }
    directionDragEnd(direction, newCoordinate){
        direction.isModified = true;
        direction.coordinate = newCoordinate;
        var filteredArray = this.state.directions.filter(item => item.id !== direction.id);
        var a = filteredArray.length;
        var list =  [
            ...filteredArray,
            direction
        ];
        var previous = this.getPreviousDirections(direction.index);
        if(previous.length > 0){
            let prev = previous[previous.length - 1];
            if (prev.isModified == true){
                let middle = Geometry.getMiddle(prev.coordinate, direction.coordinate);
                let mid = this.createDirection(middle);
                mid.isModified = false;
                mid.index = parseInt((prev.index + direction.index) / 2);
                list.push(mid);
            }
            else {
                let prev2 =  previous[previous.length - 2];
                list = list.filter(item => item.id !== prev.id);
                let middle = Geometry.getMiddle(prev2.coordinate, direction.coordinate);
                prev.coordinate = middle;
                list.push(prev);
            }
        }
        var nexts = this.getNextDirections(direction.index);
        if(nexts.length > 0){
            var next = nexts[0];
            // if next marker is nodified then it means next marker will be not updated coordinate
            // and we must create new on between current marker and next marker
            if (next.isModified == true){
                let middle = Geometry.getMiddle(direction.coordinate, next.coordinate);
                let mid = this.createDirection(middle);
                mid.index = parseInt((next.index + direction.index) / 2);
                mid.isModified = false;
                list.push(mid);
            }
            // if next marker is not modified yet then it mean the next marker is just created between 
            // current marker and the another next marker, so we just update coordinate of next marker
            
            else{
                let next2 =  nexts[1];
                list = list.filter(item => item.id !== next.id);
                let middle = Geometry.getMiddle(next2.coordinate, direction.coordinate);
                next.coordinate = middle;
                list.push(next);
            }
        }
        this.setState({
            directions: list.sort(function(a, b){return a.index - b.index;})
        });
    }
    renderMarkersForDirection(){
        var markers = [];
        this.state.directions.map((direction, idx) => (
            
           
            markers.push (<MapView.Marker
                draggable
                coordinate={direction.coordinate}
                title={direction.title}
                description={direction.description}
                key = {direction.key}
                id = {direction.id}
                onDragEnd={(e) => this.directionDragEnd(direction, e.nativeEvent.coordinate)}
                // onPress={(e) => alert(marker.userData)}
            /> )                       
            
        ));
        return markers;

    }
    renderRoutesForDirection(){
        var routes = [];        
        var count =  this.state.directions.length - 1;
        var i = 0;

        for(i ; i < count; i++){
            var coors = [this.state.directions[i].coordinate, this.state.directions[i + 1].coordinate];
            var id = KeyGen.uuid_v4();
            routes.push (
                <MapView.Polyline
                    key={id}
                    coordinates={coors}
                    strokeColor="#000"
                    fillColor="rgba(255,0,0,0.5)"
                    strokeWidth={1}
              />
            );
        }
       
        return routes;

    }
    onRegionChange(region) {
        this.setState({});
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView

                    provider={this.props.provider}
                    onPress={(e) => this.onMapPress(e)}
                    enableClustering={false}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    style={styles.map}
                    initialRegion={this.state.region}
                >                    
                    {                      
                        this.renderMarkersForDirection()                        
                    }
                    {                      
                        this.renderRoutesForDirection()                        
                    }

                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

