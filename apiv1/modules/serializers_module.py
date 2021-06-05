def result_P_rate(result_P):
    rate_P  = 0

    if   (result_P <  5): rate_P = 1
    elif (result_P < 10): rate_P = 2
    elif (result_P < 30): rate_P = 3
    elif (result_P < 60): rate_P = 4
    else                : rate_P = 5

    return rate_P

def result_K_rate(result_K):
    rate_K  = 0

    if   (result_K <  8): rate_K = 1
    elif (result_K < 15): rate_K = 2
    elif (result_K < 30): rate_K = 3
    elif (result_K < 50): rate_K = 4
    elif (result_K < 70): rate_K = 5
    else                : rate_K = 6

    return rate_K

def result_Mg_rate(result_Mg):
    rate_Mg = 0

    if   (result_Mg < 10): rate_Mg = 1
    elif (result_Mg < 25): rate_Mg = 2
    elif (result_Mg < 45): rate_Mg = 3
    else                 : rate_Mg = 5
    
    return rate_Mg