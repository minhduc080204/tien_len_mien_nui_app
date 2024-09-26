import React, { Component } from "react"
import HandCard from "./components/HandCard"

class PlayArea extends Component {    
    render() {
        const {
            onGetHand,
            onSortCart,
            onAttack,
            renderCard,
            hand,
        } = this.props
        return (<React.Fragment>
            <button onClick={onGetHand}>Chia bài</button>            
            <div className="playarea">
                <HandCard
                    renderCard = {(card)=>renderCard(card)}
                    hand={hand}
                />
                <button onClick={
                    onSortCart
                }>Xếp Bài</button>
                <button
                    onClick={
                        onAttack
                    }
                >Đánh bài</button>
            </div>
        </React.Fragment>)
    }
}

export default PlayArea

// const [hand1, setHand1] = useState([])
    // const [hand1_sort, setHandSort1] = useState([])
    // const [hand1_not_sort, setHandNotSort1] = useState([])
    // const [check_sort, setCheckSort] = useState(1);

    // const getHand = async () => {
    //     let res = await dealCard();
    //     setHand1([...res])
    //     setHandNotSort1([...res]);
    //     setHandSort1([...res].sort((a, b) => a.rank - b.rank));
    // }


    

    // const handleAttack = async () => {
    //     try {
    //         let response = await attack(100);
    //         console.log(response.data); // Xử lý response từ server
    //     } catch (error) {
    //         console.error(error); // Xử lý lỗi nếu yêu cầu thất bại
    //     }
    // }

    // useEffect(() => {
    //     getHand()
    // }, []);