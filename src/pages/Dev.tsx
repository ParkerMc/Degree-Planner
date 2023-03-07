import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { decrement, increment } from '../features/dev/devSlice'

export default function Dev() {
    const count = useAppSelector((state) => state.dev.value)
    const dispatch = useAppDispatch()

    const Container = styled.div`
        display: flex;
        justify-content: center;
    `
    const InnerContainer = styled.div`
        display: flex;
        flex-direction: column;
    `
    const ButtonBox = styled.div`
        display: flex;
        gap: 10px;
    `
    const ReduxButton = styled.button`
        flex-basis: 2em;
    `

    return (
        <Container>
            <InnerContainer>
                <div>
                    <h2>Pages:</h2>
                    <ButtonBox>
                        <Link to="/">
                            <button>Home</button>
                        </Link>
                        <Link to="/additionalInfo">
                            <button>Additional Info</button>
                        </Link>
                        <Link to="/degreePlan">
                            <button>Degree Plan</button>
                        </Link>
                        <Link to="/print">
                            <button>Print</button>
                        </Link>
                    </ButtonBox>
                </div>
                <div>
                    <h2>Redux Example</h2>
                    <h3>{count}</h3>
                    <ButtonBox>
                        <ReduxButton onClick={() => dispatch(decrement())}>
                            -
                        </ReduxButton>
                        <ReduxButton onClick={() => dispatch(increment())}>
                            +
                        </ReduxButton>
                    </ButtonBox>
                </div>
            </InnerContainer>
        </Container>
    )
}
