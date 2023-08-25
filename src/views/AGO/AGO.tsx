import React, {useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';
import SafeView from '../../components/SafeView';
import Container from '../../components/Container';
import Category from '../../components/AGO/Category';
import {CategoryObject} from '../../constants/AGO';
import {clearResponses} from '../../features/AGO/agoSlice';
import {useSelector, useDispatch} from 'react-redux';

const AGO = () => {
  const scrollView = useRef<ScrollView>(null);
  const viewableCategories = useSelector(
    (state: {ago: {viewableCategories: CategoryObject[]}}) =>
      state.ago.viewableCategories,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearResponses());
  }, [dispatch]);

  return (
    <SafeView edges={['left', 'right']}>
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() =>
          scrollView.current?.scrollToEnd({animated: true})
        }>
        <Container>
          {
            <>
              {viewableCategories.map((category, index) => (
                <Category
                  key={index}
                  title={
                    category.recommendation
                      ? (category.recommendation as string)
                      : (category.title as string)
                  }
                  subTitle={category.subTitle as string}
                  options={category.recommendation ? [] : ['Yes', 'No']}
                />
              ))}
            </>
          }
        </Container>
      </ScrollView>
    </SafeView>
  );
};

export default AGO;
