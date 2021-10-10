import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DropDownList from "../general/DropDownList";
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import { withRouter } from 'react-router-dom';
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";

class MakeItPersonalScreen extends React.Component{
    style = useStyles;
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            type: 0,
            size: 0,
            display: 0,
            cost: 0,
        };

        this.handleCardType = this.handleCardType.bind(this);
        this.handleCard = this.handleCard.bind(this);

    }

    async handleSaveData(){
        const currentCost = this.state.type + this.state.size + this.state.display;

        const cost = currentCost;
        this.setState({
            cost: currentCost
        });
        const obj = {
            id: this.props.match.params.id,
            amount: 1,
            card: [{
                wishes: this.state.value,
                price: cost,
                type: this.state.type,
                size: this.state.size,
                display: this.state.display
            }]
        }
        const body = {
            selectedPackage: obj,
            updateType: "add"
        }

        const res = (await requestToServer("/updateCart", 'POST', body));
        if(res.ok){
            alert("Package successfully added");
            this.props.history.push("/mainScreen");
        }else{
            redirect(res.onError, this.props);
        }
    }

    handleCard(event){
        const value = event.target.value;
        this.setState({value: value});
    }

    handleCardType(event){
        const value = event.target.value;
        const valueAsNumber = parseInt(value);
        if(!isNaN(valueAsNumber)){
            this.setState({
                type: valueAsNumber
            });
        } else {
            this.handleOptionsChange(value);
        }
    }

    handleOptionsChange(value){
        let num;
        if(!value.includes('free')){
            const start = value.indexOf('+') + 1;
            const end = value.indexOf('₪');
            num = parseInt(value.slice(start,end));
        } else {
            num = 0;
        }

        if(value.includes('Size')){
            this.setState({
                size: num
            });
        }else{
            this.setState({
                display: num
            });
        }
    }

    render() {
        return(
            <div>
                <PageDescription pageName = "Make It Personal"/>
                <Card onBlur={event => this.handleCard(event)} onChange={event => this.handleCard(event)}/>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CardType className={this.style.CardProperties} onChange={this.handleCardType}/>
                </div>
                <br/>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <input type="button"
                           value="Save"
                           className="SaveButton"
                           onClick={this.handleSaveData.bind(this)}
                           style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                    />
                </div>
            </div>
        );
    }
}

function Card(props) {
    const style = useStyles();

    return (
        <form className={style.root} noValidate autoComplete="off">
            <FormControl className={style.card}>
                <label className={style.label}>
                    Write a greeting card that will be attached to your package:
                </label>
                <TextField
                    id="outlined-textarea"
                    label="Greeting Card"
                    placeholder="write your wishes here..."
                    multiline
                    rows={10}
                    variant="outlined"
                    onChange={props.onChange}
                />
            </FormControl>
        </form>
    );
}

function OptionalCardProperties(props){
    return(
        <div className='OptionalCardProperties'>
            <FormControl variant="outlined">
                <InputLabel>Size</InputLabel>
                <DropDownList
                    listSubject='Size'
                    listOptions={['Small Size free','Medium Size +10₪','Big Size +20₪']}
                    onChange={props.onChange}
                />
            </FormControl>
            <br/>
            <br/>
            <FormControl variant="outlined">
                <InputLabel>Display</InputLabel>
                <DropDownList
                    listSubject='Display'
                    listOptions={['Handwriting free','Printed +10₪']}
                    onChange={props.onChange}
                />
            </FormControl>
        </div>
    );
}

class CardType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'None',
        };
    }

    handleType(event){
        const value = event.target.value;
        this.setState({
            type: value
        });
    }

    render() {
        return (
            <div>
                <FormControl variant="outlined">
                    <InputLabel>Type</InputLabel>
                    <Select native label="Type" onChange={(event) => {
                        this.handleType(event);
                        this.props.onChange(event)
                    }}>
                        <option value='0'>Regular free</option>
                        <option value='10'>music +10₪</option>
                        <option value='20'>3D +20₪</option>
                    </Select>
                </FormControl>
                <br/>
                <br/>
                {this.state.type !== 'None' ? <OptionalCardProperties onChange={this.props.onChange}/> : null}
            </div>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },

        marginTop: theme.spacing(5),
        marginLeft: theme.spacing(50),
        textAlign: "left",
    },

    CardProperties: {
        margin: theme.spacing(1),
        minWidth: 120,
        position: "absolute",
        top: '23.5ch',
        right: '18ch'
    },
    buttons: {
        textAlign: "center",
        marginTop: theme.spacing(5),
    },
    card: {
        width: '60ch',
    },
    h1: {
        textAlign: "center",
    },
    buttonBack: {
        margin: theme.spacing(1),
    },
    label: {
        marginLeft: theme.spacing(1),
    }
}));

export default withRouter(MakeItPersonalScreen);
