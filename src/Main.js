import
    React, {
        useState
        , useEffect
} from 'react';

import Container from './Container';
import { API } from 'aws-amplify';
import { List } from 'antd';
import checkUser from './checkUser';

const Main = () => {

    const [state, setState] = useState(
        {
            products: []
            , loading: true
        }
    );

    const [user, updateUser] = useState({});

    let didCancel = false;

    useEffect(
        () => {
            getProducts();
            checkUser(updateUser);

            return () => didCancel = true;
        }
        , []
    );

    const getProducts = async () => {

        const data = await API.get('ecommerceapi21s', '/products');
        console.log('data: ', data);

        // Sentinals... Do check, and bail if necessary...
        if (didCancel) {
            return;
        }

        setState(
            {
                products: data.data.Items
                , loading: false
            }
        );
    };

    const deleteItem = async (id) => {
        try {
            const products = state.products.filter(p => p.id !== id);

            setState(
                {
                    ...state
                    , products: products
                }
            );

            await API.del(
                'ecommerceapi21s'
                , '/products'
                , {
                    body: {
                        id: id
                    }
                }
            );

            console.log('successfully deleted item');

        } catch (err) {
            console.error('error: ', err);

            // Might consider refreshing the list...
        }
    };

    return (
        <Container>
            <List
                itemLayout="horizontal"
                dataSource={state.products}
                loading={state.loading}
                renderItem={item => (
                    <List.Item
                        actions={
                            user.isAuthorized
                            ? [
                                (<p
                                    onClick={() => deleteItem(item.id)}
                                    key={item.id}>
                                        delete
                                </p>)
                            ]
                            : null
                        }
                    >
                        <List.Item.Meta
                            title={item.name}
                            description={item.price}
                        />
                    </List.Item>
                )}
            />
        </Container>
    );
}

export default Main;
