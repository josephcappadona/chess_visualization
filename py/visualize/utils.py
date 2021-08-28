def hash_params(params):
    ratingHash = hash(params['ratingRange'][0]) ^ hash(params['ratingRange'][1])
    themesHash = hash(params['themesOperator'])
    for theme in params['themes']:
        themesHash ^= hash(theme)
    return ratingHash ^ themesHash