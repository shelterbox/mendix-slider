import { Component, createElement } from "react";
import Big from "big.js";
import SliderWidget from "@material-ui/core/Slider";
import "./ui/Slider.css";

export default class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: undefined
        };

        this.onInputChange = this.handleChange.bind(this);
        this.onCommitChange = this.handleChangeCommited.bind(this);
    }
    valuetext(value) {
        return value;
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    handleChangeCommited = (event, newValue) => {
        if (!this.props.secondValueAttribute) {
            this.props.valueAttribute.setValue(Big(newValue));
        } else {
            this.props.valueAttribute.setValue(Big(newValue[0]));
            this.props.secondValueAttribute.setValue(Big(newValue[1]));
        }

        const { onChangeAction } = this.props;
        if (onChangeAction && onChangeAction.canExecute) {
            onChangeAction.execute();
        }
    };

    convertValue(min, max, value) {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;
    }

    componentDidUpdate(prevProps) {
        const newValue = this.convertValue(
            Number(this.props.min.value),
            Number(this.props.max.value),
            Number(this.props.valueAttribute.value)
        );
        if (!this.props.secondValueAttribute) {
            if (prevProps.valueAttribute !== this.props.valueAttribute) {
                this.setState({ value: newValue });
            }
        } else {
            if (
                prevProps.valueAttribute !== this.props.valueAttribute &&
                prevProps.secondValueAttribute !== this.props.secondValueAttribute
            ) {
                const secondValue = this.convertValue(
                    Number(this.props.min.value),
                    Number(this.props.max.value),
                    Number(this.props.secondValueAttribute.value)
                );

                this.setState({
                    value: [newValue, secondValue]
                });
            }
        }
    }

    render() {
        //marks moeten op een value komen value = markpoint
        // marks krijgen een text = markstring
        //vullen met marks in de frontend. Hoe

        /*         const markList = this.props.markList.map(markItem =>
            {
                const mark = {value:markItem.markPoint, label: markItem.markSrting}
                return mark;
            });
 */

        let disabled;

        let orientation;

        if (this.state.value === undefined) {
            return "Foutje...... Volgende keer beter";
        }

        if (this.props.isDisabled === undefined) {
            disabled = false;
        } else {
            disabled = this.props.isDisabled.value;
        }

        if (this.props.isVertical) {
            orientation = "vertical";
        } else {
            orientation = "horizontal";
        }

        return (
            <SliderWidget
                step={Number(this.props.stepNr.value)}
                disabled={disabled}
                value={this.state.value}
                onChange={this.onInputChange}
                onChangeCommitted={this.onCommitChange}
                getAriaValueText={this.valuetext}
                valueLabelDisplay="auto"
                min={Number(this.props.min.value)}
                max={Number(this.props.max.value)}
                orientation={orientation}
            />
        );
    }
}
