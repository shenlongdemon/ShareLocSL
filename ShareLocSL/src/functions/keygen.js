
import React from 'react';

export default class KeyGen extends React.Component {

    constructor(props) {
        super(props);
    }
    static milisecond(){
        var milliseconds = (new Date).getTime();
        return milliseconds;
    }
    static uuid_v4(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
   
}