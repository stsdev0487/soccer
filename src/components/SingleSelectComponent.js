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
    },
    viewContainer: { 
        flex: 1 
    },
    searchStyle: { 
        color: '#b5b5b5', 
    }
});

export default class MultiselectComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { itemValue: [props.input.value] };
    }

    onSelectedItemsChange = itemValue => {
        let { input } = this.props;
        this.setState({itemValue});
        input.onChange(itemValue[0]);
      };

    render() {
        let {items, uniqueKey} = this.props;
        console.log(items);
        return (
            <View>
                <View style={styles.formCountry}>
                    <View style={styles.viewContainer}>
                        <MultiSelect
                            hideTags
                            items={items}
                            single={true}
                            uniqueKey={uniqueKey || "id"}
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.itemValue}
                            selectText="Select One"
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
                            colors={{itemBackground: 'red', subItemBackground: 'blue'}}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
