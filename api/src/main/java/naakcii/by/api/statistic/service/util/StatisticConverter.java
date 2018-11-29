package naakcii.by.api.statistic.service.util;

import naakcii.by.api.statistic.repository.model.Statistic;
import naakcii.by.api.statistic.service.modelDTO.StatisticDTO;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StatisticConverter {

    public StatisticDTO convert(Optional<Statistic> statistic) {
        StatisticDTO statisticDTO = new StatisticDTO();
        statisticDTO.setChainQuantity(statistic.getChainQuantity());
        statisticDTO.setAverageDiscount(statistic.getAverageDiscount());
        statisticDTO.setDiscountedGoods(statistic.getDiscountedGoods());
        statisticDTO.setId(statistic.getId());
        return statisticDTO;
    }
}
