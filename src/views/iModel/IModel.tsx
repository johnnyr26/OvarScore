import React, {useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';
import SafeView from '../../components/SafeView';
import Container from '../../components/Container';
import Category from '../../components/iModel/Category';
import ScoreContainer from '../../components/ScoreContainer';
import {categories} from '../../constants/iModel';
import {iModelType} from '../../constants/iModel';
import {clearResponses} from '../../features/iModel/iModelSlice';
import {useSelector, useDispatch} from 'react-redux';

const IModel = () => {
  const scrollView = useRef<ScrollView>(null);
  const recommendation = useSelector(
    (state: {iModel: iModelType}) => state.iModel.recommendation,
  );
  const score = useSelector(
    (state: {iModel: iModelType}) => state.iModel.score,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearResponses());
  }, [dispatch]);

  useEffect(() => {
    scrollView.current?.scrollToEnd({animated: true});
  }, [recommendation]);

  return (
    <SafeView edges={['left', 'right']}>
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => {
          if (recommendation) {
            scrollView.current?.scrollToEnd({animated: true});
          }
        }}>
        <Container>
          {
            <>
              {Object.entries(categories).map(([key, value], index) => (
                <Category key={index} title={key} options={value.options} />
              ))}
            </>
          }
          <ScoreContainer risk recommendation={recommendation} score={score} />
        </Container>
      </ScrollView>
    </SafeView>
  );
};

export default IModel;
