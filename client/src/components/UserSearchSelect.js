import React from 'react';
import AsyncSelect from 'react-select/async';
import { useLazySearchUsersQuery } from '../apis/userApi'

const UserSearchSelect = ({ onChange, value }) => {
    const [trigger] = useLazySearchUsersQuery();

    const loadOptions = async (inputValue) => {
        try {
            const result = await trigger(inputValue);
            return result.data ? result.data.map(user => ({
                label: user.email,
                value: user.id
            })) : [];
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={onChange}
            value={value}
        />
    );
};

export default UserSearchSelect;
