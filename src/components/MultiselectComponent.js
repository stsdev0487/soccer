import React from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const styles = StyleSheet.create({
    formCountry: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 30,
        marginTop: 20,
        borderColor: '#bebcbc',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    multiSelect: {
        backgroundColor: 'transparent'
    },
    selectContainer: { 
        flex: 1 
    },
    searchStyle: { 
        color: '#b5b5b5',
    }
});

export default class MultiselectComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { itemValue: props.input.value || [] };
    }

    onSelectedItemsChange = itemValue => {
        let { input } = this.props;
        this.setState({itemValue});
        input.onChange(itemValue);
      };

    render() {
        let { items, uniqueKey } = this.props;
        return (
            <View style={{}}>
                <View style={styles.formCountry}>
                    <View style={styles.selectContainer}>
                        <MultiSelect
                            hideTags
                            items={items}
                            uniqueKey={uniqueKey || "id"}
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.itemValue}
                            selectText="Select"
                            searchInputPlaceholderText="Search Items..."
                            onChangeInput={(text) => console.log(text)}
                            hideSubmitButton= {true}
                            tagRemoveIconColor="red"
                            tagBorderColor="#b5b5b5"
                            tagTextColor="#777"
                            selectedItemTextColor="#b5b5b5"
                            selectedItemIconColor="#b5b5b5"
                            itemTextColor="#777"
                            searchInputStyle={styles.searchStyle}
                            style={styles.multiSelect}
                        />
                        <View>
                            {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.itemValue)}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
