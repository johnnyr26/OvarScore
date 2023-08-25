import React, {useRef, useEffect, useState} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {clearResponses} from '../../features/Fagotti/fagottiSlice';
import SafeView from '../../components/SafeView';
import Container from '../../components/Container';
import Category from '../../components/Fagotti/Category';
import Table from '../../components/Fagotti/Table';
import {firstSection, FagottiType} from '../../constants/Fagotti';

const Fagotti = () => {
  const dispatch = useDispatch();
  const scrollView = useRef<ScrollView>(null);
  const firstSectionRecommendation = useSelector(
    (state: {fagotti: FagottiType}) => state.fagotti.firstSectionRecommendation,
  );
  const tableRecommendation = useSelector(
    (state: {fagotti: FagottiType}) => state.fagotti.tableRecommendation,
  );
  const table = useSelector(
    (state: {fagotti: FagottiType}) => state.fagotti.showTable,
  );
  const [tableY, setTableY] = useState(Dimensions.get('screen').height);

  useEffect(() => {
    dispatch(clearResponses());
  }, [dispatch]);

  return (
    <SafeView edges={['left', 'right']}>
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => {
          if (table) {
            scrollView.current?.scrollTo({y: tableY});
          }
          if (tableRecommendation) {
            scrollView.current?.scrollToEnd({animated: true});
          }
        }}>
        <Container>
          {
            <>
              {firstSection.map((title, index) => (
                <Category key={index} title={title} options={['Yes', 'No']} />
              ))}
              {firstSectionRecommendation && (
                <Category title={firstSectionRecommendation} options={[]} />
              )}
            </>
          }
        </Container>
        {
          <>
            {table && (
              <View
                onLayout={event => {
                  setTableY(event.nativeEvent.layout.y);
                }}>
                <Table />
              </View>
            )}
          </>
        }
      </ScrollView>
    </SafeView>
  );
};

export default Fagotti;
